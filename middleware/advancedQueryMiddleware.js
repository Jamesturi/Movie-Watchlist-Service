// middleware/advancedQueryMiddleware.js
const { ValidationError } = require('../utils/errorHandler');

// Middleware to parse and validate advanced query parameters
const advancedQuery = (model, schema) => async (req, res, next) => {
  try {
    // Validate query parameters if schema is provided
    if (schema) {
      const { error, value } = schema.validate(req.query, { 
        abortEarly: false,
        stripUnknown: true
      });
      
      if (error) {
        const errorMessage = error.details.map(detail => detail.message).join(', ');
        return next(new ValidationError(errorMessage));
      }
      
      // Replace req.query with validated value
      req.query = value;
    }
    
    // Get query parameters
    let { sort, page, limit, select, ...filter } = req.query;
    
    // Always limit results to the authenticated user if applicable
    if (req.user && req.user.id) {
      filter.user = req.user.id;
    }
    
    // Build query
    let query = model.find(filter);
    
    // Select fields
    if (select) {
      const fields = select.split(',').join(' ');
      query = query.select(fields);
    }
    
    // Sort
    if (sort) {
      const sortBy = sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    
    // Pagination
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments(filter);
    
    query = query.skip(startIndex).limit(limit);
    
    // Execute query
    const results = await query;
    
    // Pagination result
    const pagination = {};
    
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    
    pagination.current = { page, limit };
    pagination.total = Math.ceil(total / limit);
    
    // Add results to request
    req.advancedQuery = {
      success: true,
      count: results.length,
      pagination,
      data: results
    };
    
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = advancedQuery;