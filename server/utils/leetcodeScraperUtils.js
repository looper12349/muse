/**
 * leetcodeScraperUtils.js
 * A robust utility for scraping LeetCode problem information
 */
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const { setTimeout } = require('timers/promises');

// Configure user agents to rotate
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:90.0) Gecko/20100101 Firefox/90.0'
];

/**
 * Extract problem ID and slug from LeetCode URL
 */
const extractProblemInfo = (url) => {
  // Extract problem slug from URL like https://leetcode.com/problems/two-sum/description/
  const match = url.match(/\/problems\/([^/]+)/);
  const problemSlug = match ? match[1] : null;
  
  // Also try to extract numerical ID if present in URL
  const idMatch = url.match(/\/problems\/(\d+)\//);
  const problemNumber = idMatch ? idMatch[1] : null;
  
  return { problemSlug, problemNumber };
};

/**
 * Get a random user agent from the list
 */
const getRandomUserAgent = () => {
  const randomIndex = Math.floor(Math.random() * USER_AGENTS.length);
  return USER_AGENTS[randomIndex];
};

/**
 * Fetch problem details from LeetCode using axios and cheerio
 */
const fetchProblemDetailsWithAxios = async (url) => {
  try {
    // Add random delay to avoid detection (between 1-3 seconds)
    const delay = Math.floor(Math.random() * 2000) + 1000;
    await setTimeout(delay);
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://leetcode.com/',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'max-age=0'
      },
      timeout: 10000 // 10 second timeout
    });
    
    const $ = cheerio.load(response.data);
    
    // Extract title (multiple possible selectors)
    let title = $('[data-cy="question-title"]').text().trim() || 
                $('title').text().replace(' - LeetCode', '').trim();
    
    // If title contains a number prefix, extract just the number
    const titleNumberMatch = title.match(/^(\d+)\./);
    const problemNumber = titleNumberMatch ? titleNumberMatch[1] : null;
    
    // Extract difficulty
    let difficulty = 'Unknown';
    const difficultyElem = $('.text-difficulty-medium, .text-difficulty-easy, .text-difficulty-hard') || 
                           $('[data-cy="question-difficulty"]') || 
                           $('.difficulty-label');
    
    if (difficultyElem.length) {
      const diffText = difficultyElem.text().trim().toLowerCase();
      if (diffText.includes('easy') || difficultyElem.hasClass('text-difficulty-easy')) difficulty = 'Easy';
      if (diffText.includes('medium') || difficultyElem.hasClass('text-difficulty-medium')) difficulty = 'Medium';
      if (diffText.includes('hard') || difficultyElem.hasClass('text-difficulty-hard')) difficulty = 'Hard';
    }
    
    // Extract description (multiple possible selectors)
    const description = $('.elfjS').html() || 
                        $('[data-track-load="description_content"]').html() || 
                        $('.question-content').html() || 
                        $('[data-cy="question-content"]').html() || 
                        $('.content__u3I1').html() || 
                        $('.description__24sA').html() || '';
    
    // Extract tags
    const tags = [];
    // Try different selectors that might contain tags
    $('.tag__2PqS, [data-cy="question-tags"] .tag, .flex.gap-2 .bg-fill-secondary').each((i, el) => {
      const tag = $(el).text().trim();
      if (tag && !tag.includes('Easy') && !tag.includes('Medium') && !tag.includes('Hard')) {
        tags.push(tag);
      }
    });
    
    return {
      title,
      problemNumber,
      difficulty,
      description: description.trim(),
      tags,
      raw: response.data // store raw HTML for debugging
    };
  } catch (error) {
    console.error('Error fetching problem details with Axios:', error.message);
    // If we get blocked or encounter errors, return null to try puppeteer method
    return null;
  }
};

/**
 * Fetch problem details from LeetCode using Puppeteer (headless browser)
 * This is used as a fallback when simple HTTP requests are blocked
 */
const fetchProblemDetailsWithPuppeteer = async (url) => {
  let browser = null;
  try {
    // Launch puppeteer with stealth settings
    browser = await puppeteer.launch({
      headless: 'new', // Use new headless mode
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--disable-blink-features=AutomationControlled'
      ]
    });
    
    const page = await browser.newPage();
    
    // Set a viewport
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Set user agent
    await page.setUserAgent(getRandomUserAgent());
    
    // Set extra HTTP headers
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'DNT': '1'
    });
    
    // Override browser fingerprinting
    await page.evaluateOnNewDocument(() => {
      // Override navigator properties to use non-headless values
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false
      });
      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5]
      });
    });
    
    // Add random delay to mimic human behavior
    await setTimeout(Math.floor(Math.random() * 2000) + 2000);
    
    // Navigate to the page
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Wait for content to load
    await page.waitForSelector('[data-cy="question-title"], .question-title', { timeout: 10000 })
      .catch(() => console.log('Title selector not found, continuing anyway'));
    
    // Extract title
    const title = await page.evaluate(() => {
      const titleElement = document.querySelector('[data-cy="question-title"]') || 
                          document.querySelector('.question-title');
      return titleElement ? titleElement.textContent.trim() : 
             document.title.replace(' - LeetCode', '').trim();
    });
    
    // Extract difficulty
    const difficulty = await page.evaluate(() => {
      const difficultyElement = document.querySelector('.text-difficulty-medium, .text-difficulty-easy, .text-difficulty-hard') || 
                              document.querySelector('[data-cy="question-difficulty"]') || 
                              document.querySelector('.difficulty-label');
      if (!difficultyElement) return 'Unknown';
      
      const diffText = difficultyElement.textContent.trim().toLowerCase();
      if (diffText.includes('easy') || difficultyElement.classList.contains('text-difficulty-easy')) return 'Easy';
      if (diffText.includes('medium') || difficultyElement.classList.contains('text-difficulty-medium')) return 'Medium';
      if (diffText.includes('hard') || difficultyElement.classList.contains('text-difficulty-hard')) return 'Hard';
      return 'Unknown';
    });
    
    // Extract description
    const description = await page.evaluate(() => {
      const descElement = document.querySelector('.elfjS') || 
                         document.querySelector('[data-track-load="description_content"]') || 
                         document.querySelector('[data-cy="question-content"]') || 
                         document.querySelector('.question-content') || 
                         document.querySelector('.content__u3I1') || 
                         document.querySelector('.description__24sA');
      return descElement ? descElement.innerHTML : '';
    });
    
    // Extract tags
    const tags = await page.evaluate(() => {
      const tagElements = document.querySelectorAll('.tag__2PqS, [data-cy="question-tags"] .tag, .flex.gap-2 .bg-fill-secondary');
      return Array.from(tagElements)
        .map(el => el.textContent.trim())
        .filter(text => text && !text.includes('Easy') && !text.includes('Medium') && !text.includes('Hard'));
    });
    
    // Try to extract problem number from title
    const titleNumberMatch = title.match(/^(\d+)\./);
    const problemNumber = titleNumberMatch ? titleNumberMatch[1] : null;
    
    return {
      title,
      problemNumber,
      difficulty,
      description: description.trim(),
      tags
    };
  } catch (error) {
    console.error('Error fetching problem details with Puppeteer:', error.message);
    return {
      title: 'Unknown Problem',
      difficulty: 'Unknown',
      description: '',
      tags: []
    };
  } finally {
    if (browser) await browser.close();
  }
};

/**
 * Try to extract problem details using GraphQL API
 * LeetCode has a GraphQL API that may be more reliable than scraping
 */
const fetchProblemDetailsWithGraphQL = async (problemSlug) => {
  try {
    const response = await axios.post('https://leetcode.com/graphql', {
      query: `
        query questionData($titleSlug: String!) {
          question(titleSlug: $titleSlug) {
            questionId
            questionFrontendId
            title
            titleSlug
            content
            difficulty
            topicTags {
              name
              slug
            }
          }
        }
      `,
      variables: { titleSlug: problemSlug }
    }, {
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Content-Type': 'application/json',
        'Referer': `https://leetcode.com/problems/${problemSlug}/`,
      }
    });
    
    const questionData = response.data?.data?.question;
    
    if (!questionData) {
      return null;
    }
    
    return {
      title: questionData.title,
      problemNumber: questionData.questionFrontendId,
      difficulty: questionData.difficulty,
      description: questionData.content,
      tags: questionData.topicTags.map(tag => tag.name),
      slug: questionData.titleSlug
    };
  } catch (error) {
    console.error('Error fetching problem details with GraphQL:', error.message);
    return null;
  }
};

/**
 * Main function to fetch problem details using multiple strategies
 */
const fetchProblemDetails = async (url) => {
  const { problemSlug } = extractProblemInfo(url);
  
  // Try GraphQL API first (most reliable and least likely to get blocked)
  if (problemSlug) {
    const graphQLResult = await fetchProblemDetailsWithGraphQL(problemSlug);
    if (graphQLResult) return graphQLResult;
  }
  
  // Next, try simple axios/cheerio method
  const axiosResult = await fetchProblemDetailsWithAxios(url);
  if (axiosResult) return axiosResult;
  
  // If both fail, use puppeteer as a last resort
  console.log('Falling back to puppeteer for LeetCode scraping');
  return fetchProblemDetailsWithPuppeteer(url);
};

/**
 * Get problem with cache handling and rate limiting
 */
class LeetCodeScraper {
  constructor(options = {}) {
    // In-memory cache to reduce repeated scraping
    this.cache = new Map();
    
    // Cache expiry time in ms (default: 24 hours)
    this.cacheExpiry = options.cacheExpiry || 24 * 60 * 60 * 1000;
    
    // Rate limiting
    this.requestQueue = [];
    this.isProcessingQueue = false;
    this.minRequestInterval = options.minRequestInterval || 3000; // 3 seconds between requests
    
    // Configure proxy support if needed
    this.proxy = options.proxy || null;
  }
  
  /**
   * Fetch problem details with rate limiting and caching
   */
  async getProblemDetails(leetcodeUrl) {
    // Check cache first
    if (this.cache.has(leetcodeUrl)) {
      const cachedData = this.cache.get(leetcodeUrl);
      
      // Return if cache is still valid
      if (Date.now() - cachedData.timestamp < this.cacheExpiry) {
        return cachedData.data;
      }
      
      // Otherwise remove from cache
      this.cache.delete(leetcodeUrl);
    }
    
    // Add to request queue
    return new Promise((resolve) => {
      this.requestQueue.push({
        url: leetcodeUrl,
        resolve
      });
      
      if (!this.isProcessingQueue) {
        this.processQueue();
      }
    });
  }
  
  /**
   * Process the queue with rate limiting
   */
  async processQueue() {
    if (this.requestQueue.length === 0) {
      this.isProcessingQueue = false;
      return;
    }
    
    this.isProcessingQueue = true;
    const { url, resolve } = this.requestQueue.shift();
    
    try {
      const result = await fetchProblemDetails(url);
      
      // Cache the result
      this.cache.set(url, {
        timestamp: Date.now(),
        data: result
      });
      
      resolve(result);
    } catch (error) {
      console.error(`Error processing queue for ${url}:`, error);
      resolve({
        title: 'Unknown Problem',
        difficulty: 'Unknown',
        description: '',
        tags: []
      });
    }
    
    // Wait before processing next request
    await setTimeout(this.minRequestInterval);
    this.processQueue();
  }
}

module.exports = {
  LeetCodeScraper,
  extractProblemInfo,
  fetchProblemDetails
};