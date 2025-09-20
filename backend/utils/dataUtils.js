// backend/utils/dataUtils.js
const getValueByPath = (obj, path) => {
    if (Array.isArray(path)) {
      return path.map(p => getValueByPath(obj, p));
    }
    
    const parts = path.split('.');
    let value = obj;
    
    for (const part of parts) {
      if (part.includes('[') && part.includes(']')) {
        // Handle array queries like exercises[?id==235]
        const [arrayPath, query] = part.split(/\[|\]/).filter(Boolean);
        value = value[arrayPath];
        
        if (query && query.startsWith('?id==')) {
          const id = parseInt(query.split('==')[1], 10);
          value = value.find(item => item.id === id);
        }
      } else if (value && typeof value === 'object') {
        value = value[part];
      } else {
        return undefined;
      }
    }
    
    return value;
  };
  
  const classifyValue = (value, classifications) => {
    if (!classifications) return null;
    
    for (const classification of classifications) {
      const [min, max] = classification.range;
      if (value >= min && value <= max) {
        return classification.status;
      }
    }
    
    return "Unknown";
  };
  
  module.exports = {
    getValueByPath,
    classifyValue
  };