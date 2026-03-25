const formatResponse = (req, res, next) => {
  const originalJson = res.json;

  const convertToXML = (data, rootName = "response") => {
    let xml = `<${rootName}>`;

    if (Array.isArray(data)) {
      data.forEach(item => {
        xml += convertToXML(item, "item");
      });
    } else if (typeof data === "object" && data !== null) {
      for (const key in data) {
        xml += convertToXML(data[key], key);
      }
    } else {
      xml += `${data}`;
    }

    xml += `</${rootName}>`;
    return xml;
  };

  res.json = function (obj) {
    const acceptHeader = req.headers.accept || "";

    if (acceptHeader.includes("application/xml")) {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>${convertToXML(obj)}`;
      res.set("Content-Type", "application/xml");
      return res.send(xml);
    }

    res.set("Content-Type", "application/json");
    return originalJson.call(this, obj);
  };

  next();
};

module.exports = formatResponse;