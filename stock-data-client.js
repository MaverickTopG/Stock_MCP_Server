const { Client } = require("@modelcontextprotocol/sdk/client/index.js");
const { StdioClientTransport } = require("@modelcontextprotocol/sdk/client/stdio.js");
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
  const transport = new StdioClientTransport({
    command: "node",
    args: ["stock-data-server.js"]
  });

  const client = new Client(
    { name: "stock-client", version: "1.0.0" },
    { capabilities: { tools: ["get-stock-data", "help"] } }
  );

  try {
    await client.connect(transport);

    // Get help
    const help = await client.callTool({ 
      name: "help",
      arguments: {}
    });
    console.log(help.content[0].text);

    // Get input
    const symbol = await askQuestion(rl, "Enter symbol (default AAPL): ") || "AAPL";

    // Get stock data
    const response = await client.callTool({
      name: "get-stock-data",
      arguments: { symbol }
    });

    if (response.error) {
      console.error("Error:", response.content[0].text);
    } else {
      console.log("\nStock Data:");
      console.log(`Symbol:   ${response.data.symbol}`);
      console.log(`Price:    $${response.data.price}`);
      console.log(`Time:     ${response.data.timestamp}`);
      console.log(`Volume:   ${response.data.volume}`);
    }
  } catch (error) {
    console.error("Client error:", error.message);
  } finally {
    rl.close();
    await transport.close();
  }
}

function askQuestion(rl, prompt) {
  return new Promise(resolve => rl.question(prompt, resolve));
}

main().catch(console.error);