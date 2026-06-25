const SearchService = require('../services/SearchService');

class SearchController {
    /**
     * Handle GET /api/search/:query requests.
     * Searches both restaurants and products.
     */
    static async search(req, res) {
        try {
            const { query } = req.params;

            // Enforce that query cannot be empty or just spaces
            if (!query || !query.trim()) {
                return res.status(400).json({ error: 'Search query is required and cannot be empty' });
            }

            const results = await SearchService.search(query.trim());
            return res.status(200).json(results);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = SearchController;
