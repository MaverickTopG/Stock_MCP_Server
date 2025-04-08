const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const axios = require("axios");
const { z } = require("zod");

const server = new McpServer({
  name: "stock-data-server",
  version: "1.0.0",
  description: "Real-time stock data provider via MCP"
});

server.tool(
  "get-stock-data",
  {
    symbol: z.string().default("AAPL")
  },
  async ({ symbol }) => {
    try {
      const apiKey = "YOUR_API_KEY";
      const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&apikey=${apiKey}`;

      const response = await axios.get(url);
      const timeSeries = response.data["Time Series (1min)"] || {};
      const [timestamp, data] = Object.entries(timeSeries)[0] || [];

      if (!timestamp) throw new Error("No recent data available");

      return {
        content: [{
          type: "text",
          text: `Latest ${symbol} price: $${parseFloat(data["1. open"])} at ${timestamp}`
        }],
        data: {
          symbol,
          price: parseFloat(data["1. open"]),
          timestamp,
          volume: parseInt(data["5. volume"]),
          currency: "USD"
        }
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error: ${error.message}`
        }],
        error: true
      };
    }
  }
);

server.tool(
  "help",
  {},
  async () => ({
    content: [{
      type: "text",
      text: `Available tools:
1. get-stock-data - Retrieve real-time stock prices
   Parameters: symbol (string, default: AAPL)`
    }]
  })
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("Server ready");
}

main().catch(err => {
  console.error("Server failed:", err);
  process.exit(1);
});
