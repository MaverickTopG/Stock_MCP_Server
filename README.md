# Stock Data MCP Server

An AI-powered financial data provider that delivers real-time stock market information through the Model Context Protocol (MCP). This tool enables AI systems to retrieve live prices, trading volumes, and market data directly from Alpha Vantage.

## Features

- 📈 **Real-Time Market Data**: Access minute-by-minute stock prices and volumes  
- 🤖 **AI Integration**: Structured interface for financial AI applications  
- 🔌 **MCP Compatibility**: Works with any MCP-enabled AI system  
- 🔒 **Reliable Data**: Powered by Alpha Vantage's market infrastructure

## Quick Start

### Installation

~~~bash
git clone https://github.com/MaverickTopG/Stock_MCP_Server.git
npm install
~~~

### Running the MCP Server

~~~bash
node stock-data-server.js
~~~

### Running the MCP Client for Testing

~~~bash
node stock-data-client.js
~~~

## Supported Tools

1. **get-stock-data**  
   Retrieve real-time trading data for any stock symbol.

   ~~~javascript
   // Example response
   {
     "symbol": "AAPL",
     "price": 172.34,
     "timestamp": "2024-03-15 15:59:00",
     "volume": 7845123,
     "currency": "USD"
   }
   ~~~

2. **help**  
   Get documentation about available tools and usage instructions.

   ~~~javascript
   // Example response
   {
     "content": [{
       "type": "text",
       "text": "Available tools:\n1. get-stock-data - Retrieve real-time stock prices..."
     }]
   }
   ~~~

## Example Client Usage

~~~javascript
const { Client } = require("@modelcontextprotocol/sdk/client/index.js");
const { StdioClientTransport } = require("@modelcontextprotocol/sdk/client/stdio.js");

// Create client transport
const transport = new StdioClientTransport({
  command: "node",
  args: ["stock-data-server.js"]
});

// Initialize client
const client = new Client(
  { name: "stock-client", version: "1.0.0" },
  { capabilities: { tools: ["get-stock-data", "help"] } }
);

// Connect and use tools
await client.connect(transport);

// Get stock data
const response = await client.callTool({
  name: "get-stock-data",
  arguments: { symbol: "AAPL" }
});

console.log(`Current AAPL price: $${response.data.price}`);
~~~

## Use Cases

- **AI Trading Systems:** Integrate real-time data into algorithmic trading strategies  
- **Portfolio Monitoring:** Track investments through AI assistants  
- **Financial Research:** Automate market data collection for analysis  
- **News Correlation:** Combine price data with news sentiment analysis

## Requirements

- Node.js 18+  
- @modelcontextprotocol/sdk (^1.8.0)  
- axios  
- zod  
- Alpha Vantage API key (free tier available)

## Upcoming Integrations

- Cryptocurrency market data support  
- Historical price analysis tools  
- Earnings report integration  
- Market alert systems
