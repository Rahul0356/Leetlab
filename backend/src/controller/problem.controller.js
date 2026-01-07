import { db } from '../libs/db.js';
import {
  getJude0LanguageId,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.lib.js";

export const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  // going to check the user role once again
   if (req.user.role !== "ADMIN")
     return res.status(403).json({ error: "You are not allowed to create a problem" });

  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJude0LanguageId(language);

      if (!languageId) {
        return res
          .status(400)
          .json({ error: `Language ${language} is not supported` });
      }

      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);
      const tokens = submissionResults.map((res) => res.token);
      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        console.log("Result----", result);

        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Testcase ${i + 1} failed for language ${language}`,
          });
        }
      }
    }

    // Save the problem to the database
    const newProblem = await db.problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testcases,
        codeSnippets,
        referenceSolutions,
        userId: req.user.id,
      },
    });

return res.status(201).json({
  sucess:true,
  message:"Message Created Successfully",
  problem:newProblem
});
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error:"Error while Creating Problem"
    });
  }
};


export const getAllProblems = async(req,res) => {
  try {
const problems = await db.problem.findMany();

      if(!problems){
        return res.status(404).json({
        error:"No problem Found"
      })
    }
    res.status(200).json({
      sucess:true,
      message:"Message Fetched Successfully",
      problems
    })
  } catch (error){
    console.log(error);
    return res.status(500).json({
      error:"Error While Creating Problems"
    })

  }
}

export const getProblemById = async(req,res) =>{
  const {id} = req.params;

  try{
    const problem = await db.problem.findUnique(
      { 
        where:{
        id
      }
    }
    )
    if(!problem){
      return res.status.json({error:"Problem not found."})
    }
    return res.status(200).json({
      sucess:true,
      message:"Message Created Successfully",
      problem
    });
  } catch (error){
    console.log(error);
    return res.status(500).json({
      error:"Error while Fetching Problem  by id",
    });
  }
}

export const updateProblem = async (req, res) => {
  const { id } = req.params;

  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  // Role check
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      error: "You are not allowed to update a problem",
    });
  }

  try {
    // Check if problem exists
    const existingProblem = await db.problem.findUnique({
      where: { id },
    });

    if (!existingProblem) {
      return res.status(404).json({
        error: "Problem not found",
      });
    }

    // If testcases or referenceSolutions are updated → revalidate
    if (testcases && referenceSolutions) {
      for (const [language, solutionCode] of Object.entries(
        referenceSolutions
      )) {
        const languageId = getJude0LanguageId(language);

        if (!languageId) {
          return res.status(400).json({
            error: `Language ${language} is not supported`,
          });
        }

        const submissions = testcases.map(({ input, output }) => ({
          source_code: solutionCode,
          language_id: languageId,
          stdin: input,
          expected_output: output,
        }));

        const submissionResults = await submitBatch(submissions);
        const tokens = submissionResults.map((res) => res.token);
        const results = await pollBatchResults(tokens);

        for (let i = 0; i < results.length; i++) {
          if (results[i].status.id !== 3) {
            return res.status(400).json({
              error: `Testcase ${i + 1} failed for language ${language}`,
            });
          }
        }
      }
    }

    // Update problem
    const updatedProblem = await db.problem.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(difficulty && { difficulty }),
        ...(tags && { tags }),
        ...(examples && { examples }),
        ...(constraints && { constraints }),
        ...(testcases && { testcases }),
        ...(codeSnippets && { codeSnippets }),
        ...(referenceSolutions && { referenceSolutions }),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Problem updated successfully",
      problem: updatedProblem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error while updating problem",
    });
  }
};

export const deleteProblem = async(req,res) =>{
   const { id } = req.params;

  try {
    const problem = await db.problem.findUnique({ where: { id } });

    if (!problem) {
      return res.status(404).json({ error: "Problem Not found" });
    }

    await db.problem.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: "Problem deleted Successfully",
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: "Error While deleting the problem",
    });
  }
};


export const  getAllProblemsSolvedByUser = async(req,res) => {
   try {
    const problems = await db.problem.findMany({
      where:{
        solvedBy:{
          some:{
            userId:req.user.id
          }
        }
      },
      include:{
        solvedBy:{
          where:{
            userId:req.user.id
          }
        }
      }
    })

    res.status(200).json({
      success:true,
      message:"Problems fetched successfully",
      problems
    })
  } catch (error) {
    console.error("Error fetching problems :" , error);
    res.status(500).json({error:"Failed to fetch problems"})
  }
};
