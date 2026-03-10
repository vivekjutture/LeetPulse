const fetch = require("node-fetch");

const LEETCODE_API_URL = "https://leetcode.com/graphql/";

const HEADERS = {
  "Content-Type": "application/json",
  Referer: "https://leetcode.com",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
};

// ─── GraphQL Queries ───────────────────────────────────────────

const QUERIES = {
  profile: `query getUserProfile($username: String!) {
    matchedUser(username: $username) {
      username
      githubUrl
      twitterUrl
      linkedinUrl
      profile {
        realName
        aboutMe
        userAvatar
        reputation
        ranking
        school
        countryName
        company
        jobTitle
        skillTags
        postViewCount
        solutionCount
        categoryDiscussCount
        websites
        starRating
      }
    }
  }`,

  badges: `query getUserBadges($username: String!) {
    matchedUser(username: $username) {
      badges {
        id
        displayName
        icon
        creationDate
      }
      upcomingBadges {
        name
        icon
      }
      activeBadge {
        id
        displayName
        icon
      }
    }
  }`,

  solved: `query getUserSolved($username: String!) {
    allQuestionsCount {
      difficulty
      count
    }
    matchedUser(username: $username) {
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
      }
    }
  }`,

  contest: `query getUserContest($username: String!) {
    userContestRanking(username: $username) {
      attendedContestsCount
      rating
      globalRanking
      totalParticipants
      topPercentage
    }
    userContestRankingHistory(username: $username) {
      attended
      rating
      ranking
      trendDirection
      problemsSolved
      totalProblems
      finishTimeInSeconds
      contest {
        title
        startTime
      }
    }
  }`,

  submission: `query getUserSubmission($username: String!, $limit: Int) {
    recentSubmissionList(username: $username, limit: $limit) {
      title
      titleSlug
      timestamp
      statusDisplay
      lang
    }
  }`,

  acSubmission: `query getUserAcSubmission($username: String!, $limit: Int) {
    recentAcSubmissionList(username: $username, limit: $limit) {
      id
      title
      titleSlug
      timestamp
    }
  }`,

  language: `query getUserLanguageStats($username: String!) {
    matchedUser(username: $username) {
      languageProblemCount {
        languageName
        problemsSolved
      }
    }
  }`,

  skill: `query getUserSkillStats($username: String!) {
    matchedUser(username: $username) {
      tagProblemCounts {
        advanced {
          tagName
          tagSlug
          problemsSolved
        }
        intermediate {
          tagName
          tagSlug
          problemsSolved
        }
        fundamental {
          tagName
          tagSlug
          problemsSolved
        }
      }
    }
  }`,
};

// ─── GraphQL Helper ────────────────────────────────────────────

async function queryLeetCode(query, variables = {}) {
  const response = await fetch(LEETCODE_API_URL, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`LeetCode API returned status ${response.status}`);
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(data.errors.map((e) => e.message).join("; "));
  }
  return data.data;
}

// ─── Data Fetchers ─────────────────────────────────────────────

async function fetchEndpoint(endpoint, username, params = {}) {
  const limit = params.limit ? parseInt(params.limit) : 20;
  const year = params.year ? parseInt(params.year) : undefined;

  switch (endpoint) {
    case "profile": {
      const data = await queryLeetCode(QUERIES.profile, { username });
      if (!data.matchedUser) throw new Error(`User "${username}" not found`);
      return data.matchedUser;
    }

    case "badges": {
      const data = await queryLeetCode(QUERIES.badges, { username });
      if (!data.matchedUser) throw new Error(`User "${username}" not found`);
      return data.matchedUser;
    }

    case "solved": {
      const data = await queryLeetCode(QUERIES.solved, { username });
      if (!data.matchedUser) throw new Error(`User "${username}" not found`);
      const { acSubmissionNum } = data.matchedUser.submitStatsGlobal;
      return {
        allQuestionsCount: data.allQuestionsCount,
        acSubmissionNum,
        solvedProblem: acSubmissionNum.find((s) => s.difficulty === "All")?.count || 0,
        easySolved: acSubmissionNum.find((s) => s.difficulty === "Easy")?.count || 0,
        mediumSolved: acSubmissionNum.find((s) => s.difficulty === "Medium")?.count || 0,
        hardSolved: acSubmissionNum.find((s) => s.difficulty === "Hard")?.count || 0,
      };
    }

    case "contest": {
      const data = await queryLeetCode(QUERIES.contest, { username });
      return {
        contestRanking: data.userContestRanking,
        contestHistory: data.userContestRankingHistory,
      };
    }

    case "submission": {
      const data = await queryLeetCode(QUERIES.submission, { username, limit });
      return { recentSubmissions: data.recentSubmissionList };
    }

    case "acSubmission": {
      const data = await queryLeetCode(QUERIES.acSubmission, { username, limit });
      return { recentAcSubmissions: data.recentAcSubmissionList };
    }

    case "language": {
      const data = await queryLeetCode(QUERIES.language, { username });
      if (!data.matchedUser) throw new Error(`User "${username}" not found`);
      return { languageStats: data.matchedUser.languageProblemCount };
    }

    case "skill": {
      const data = await queryLeetCode(QUERIES.skill, { username });
      if (!data.matchedUser) throw new Error(`User "${username}" not found`);
      return data.matchedUser.tagProblemCounts;
    }

    default: {
      // "full" — combine all endpoints
      const results = await Promise.allSettled([
        fetchEndpoint("profile", username),
        fetchEndpoint("badges", username),
        fetchEndpoint("solved", username),
        fetchEndpoint("contest", username),
        fetchEndpoint("submission", username, { limit: 10 }),
        fetchEndpoint("language", username),
        fetchEndpoint("skill", username),
      ]);

      if (results[0].status === "rejected") {
        throw new Error(results[0].reason.message);
      }

      const extract = (r) => (r.status === "fulfilled" ? r.value : null);
      return {
        ...extract(results[0]),
        badges: extract(results[1])?.badges || [],
        activeBadge: extract(results[1])?.activeBadge || null,
        upcomingBadges: extract(results[1])?.upcomingBadges || [],
        solved: extract(results[2]),
        contest: extract(results[3]),
        recentSubmissions: extract(results[4])?.recentSubmissions || [],
        languageStats: extract(results[5])?.languageStats || [],
        skillStats: extract(results[6]),
      };
    }
  }
}

// ─── Serverless Handler ────────────────────────────────────────

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { username, endpoint = "full", limit, year } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Missing required query parameter: username" });
  }

  try {
    const data = await fetchEndpoint(endpoint, username, { limit, year });
    return res.status(200).json(data);
  } catch (err) {
    const statusCode = err.message.includes("not found") ? 404 : 500;
    return res.status(statusCode).json({ error: err.message });
  }
};
