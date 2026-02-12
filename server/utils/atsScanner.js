const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs').promises;

/**
 * Parse resume file and extract text
 */
const parseResume = async (filePath, fileType) => {
    try {
        let text = '';

        if (fileType === 'application/pdf') {
            const dataBuffer = await fs.readFile(filePath);
            const data = await pdf(dataBuffer);
            text = data.text;
        } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const result = await mammoth.extractRawText({ path: filePath });
            text = result.value;
        } else {
            throw new Error('Unsupported file type');
        }

        return text;
    } catch (error) {
        throw new Error(`Failed to parse resume: ${error.message}`);
    }
};

/**
 * Extract keywords from text
 */
const extractKeywords = (text) => {
    const commonSkills = [
        'javascript', 'python', 'java', 'c++', 'react', 'node.js', 'mongodb', 'sql',
        'html', 'css', 'angular', 'vue', 'express', 'django', 'flask', 'spring',
        'git', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'machine learning',
        'data structures', 'algorithms', 'rest api', 'graphql', 'typescript',
        'redux', 'next.js', 'tailwind', 'bootstrap', 'sass', 'webpack', 'agile',
        'scrum', 'ci/cd', 'testing', 'jest', 'mocha', 'selenium', 'leadership',
        'communication', 'teamwork', 'problem solving'
    ];

    const lowerText = text.toLowerCase();
    const foundKeywords = commonSkills.filter(skill =>
        lowerText.includes(skill.toLowerCase())
    );

    return foundKeywords;
};

/**
 * Detect resume sections
 */
const detectSections = (text) => {
    const lowerText = text.toLowerCase();

    return {
        hasContactInfo: /email|phone|linkedin|github/.test(lowerText),
        hasEducation: /education|degree|university|college|bachelor|master/.test(lowerText),
        hasExperience: /experience|work|employment|intern|job/.test(lowerText),
        hasSkills: /skills|technologies|tools|proficient/.test(lowerText),
        hasProjects: /project|developed|built|created|implemented/.test(lowerText)
    };
};

/**
 * Calculate ATS score
 */
const calculateATSScore = (text, sections, keywords) => {
    let score = 0;

    // Section completeness (40 points)
    const sectionCount = Object.values(sections).filter(Boolean).length;
    score += (sectionCount / 5) * 40;

    // Keyword density (30 points)
    const keywordScore = Math.min(keywords.length / 10, 1) * 30;
    score += keywordScore;

    // Length check (15 points)
    const wordCount = text.split(/\s+/).length;
    if (wordCount >= 300 && wordCount <= 1000) {
        score += 15;
    } else if (wordCount > 1000) {
        score += 10;
    } else {
        score += 5;
    }

    // Formatting (15 points)
    const hasProperFormatting = /\n/.test(text) && text.length > 500;
    score += hasProperFormatting ? 15 : 5;

    return Math.round(score);
};

/**
 * Generate suggestions
 */
const generateSuggestions = (sections, keywords, score) => {
    const suggestions = [];

    if (!sections.hasContactInfo) {
        suggestions.push('Add contact information (email, phone, LinkedIn)');
    }
    if (!sections.hasEducation) {
        suggestions.push('Include your educational background');
    }
    if (!sections.hasExperience) {
        suggestions.push('Add work experience or internships');
    }
    if (!sections.hasSkills) {
        suggestions.push('Create a dedicated skills section');
    }
    if (!sections.hasProjects) {
        suggestions.push('Showcase your projects and achievements');
    }
    if (keywords.length < 5) {
        suggestions.push('Add more relevant technical skills and keywords');
    }
    if (score < 60) {
        suggestions.push('Use action verbs (developed, implemented, designed, led)');
        suggestions.push('Quantify achievements with numbers and metrics');
    }

    return suggestions;
};

/**
 * Main ATS analysis function
 */
const analyzeResume = async (filePath, fileType) => {
    try {
        // Parse resume
        const text = await parseResume(filePath, fileType);

        // Extract information
        const keywords = extractKeywords(text);
        const sections = detectSections(text);

        // Calculate score
        const atsScore = calculateATSScore(text, sections, keywords);

        // Generate suggestions
        const suggestions = generateSuggestions(sections, keywords, atsScore);

        // Missing keywords
        const allCommonSkills = [
            'javascript', 'python', 'java', 'react', 'node.js', 'mongodb', 'sql',
            'git', 'docker', 'aws', 'machine learning', 'data structures', 'algorithms'
        ];
        const missingKeywords = allCommonSkills.filter(skill => !keywords.includes(skill));

        return {
            extractedText: text.substring(0, 1000), // Store first 1000 chars
            atsScore,
            keywords: {
                found: keywords,
                missing: missingKeywords.slice(0, 10),
                suggestions: [
                    'Include industry-standard keywords',
                    'Match keywords from job descriptions',
                    'Use both acronyms and full forms (e.g., ML and Machine Learning)'
                ]
            },
            sections,
            formatting: {
                score: atsScore > 70 ? 90 : atsScore > 50 ? 70 : 50,
                issues: atsScore < 60 ? ['Improve structure', 'Add more sections'] : [],
                suggestions: [
                    'Use standard section headings',
                    'Maintain consistent formatting',
                    'Avoid tables, images, and complex layouts for ATS compatibility'
                ]
            },
            overallSuggestions: suggestions
        };
    } catch (error) {
        throw new Error(`Resume analysis failed: ${error.message}`);
    }
};

module.exports = { analyzeResume, parseResume };
