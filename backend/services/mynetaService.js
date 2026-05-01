const axios = require('axios');
const cheerio = require('cheerio');
const logger = require('./logger');

const MYNETA_BASE_URL = 'https://myneta.info/';

/**
 * Basic function to get state links or search for candidates.
 * Since myneta structure changes, this is a basic search scraper.
 */
async function searchCandidates(query) {
  try {
    // We are simulating an integration or building a scraper.
    // Myneta doesn't have an official API, so we scrape the search page
    const searchUrl = `${MYNETA_BASE_URL}search_myneta.php?q=${encodeURIComponent(query)}`;
    const response = await axios.get(searchUrl);
    const $ = cheerio.load(response.data);

    const candidates = [];
    
    // Find the correct table that has candidate info
    let targetTable = null;
    $('table').each((i, tbl) => {
      if ($(tbl).text().includes('Constituency')) {
        targetTable = tbl;
      }
    });

    if (targetTable) {
      $(targetTable).find('tr').each((i, row) => {
        if (i === 0) return; // Skip header
        
        const cols = $(row).find('> td'); // Find direct td children of the tr
        if (cols.length >= 4) {
          // In the new structure, the name and image are nested in another table
          const nameEl = $(cols[0]).find('a').first();
          const name = nameEl.text().trim() || $(cols[0]).text().trim();
          const party = $(cols[1]).text().trim();
          const constituency = $(cols[2]).text().trim();
          const state = $(cols[3]).text().trim(); // This is 'Election' which includes the State and Year
          const criminalText = $(cols[4]).text().trim();
          
          let hasCriminalRecord = false;
          if (criminalText && (criminalText === 'Y' || parseInt(criminalText) > 0)) {
              hasCriminalRecord = true;
          }
          
          let link = nameEl.attr('href');
          
          if (name && link) {
              candidates.push({
                name,
                party,
                state,
                constituency,
                hasCriminalRecord,
                link: link.startsWith('http') ? link : `${MYNETA_BASE_URL}${link.replace(/^\//, '')}`
              });
          }
        }
      });
    }

    return candidates;
  } catch (error) {
    logger.error('Error scraping MyNeta data:', error.message);
    throw new Error('Failed to fetch candidate data');
  }
}

module.exports = {
  searchCandidates
};
