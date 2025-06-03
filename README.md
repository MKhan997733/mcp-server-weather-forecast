# Weather Forecast MCP Server

A Model Context Protocol (MCP) server that provides weather information and alerts for US states and UK cities/towns using the National Weather Service (NWS) API. This server enables AI assistants to fetch current weather forecasts and alerts through a standardized interface.

## Features

- **Weather Alerts**: Get active weather alerts for any US state or UK city/town
- **Weather Forecasts**: Retrieve detailed weather forecasts using latitude and longitude coordinates
- **API Key Required**: Requires an API key for UK weather services
- **Real-time Data**: Access current weather information directly from official government sources
- **MCP Compatible**: Works with any MCP-compatible AI assistant or client

## Installation

### From Source

Clone the repository and install dependencies:

```bash
git clone https://github.com/MKhan997733/mcp-server-weather-forecast.git
cd mcp-server-weather-forecast
npm install
npm run build
```

## Configuration

### Claude Desktop

Add the following configuration to your `claude_desktop_config.json` file:

```json
{
  "mcpServers": {
    "weather": {
      "command": "npx",
      "args": ["mcp-server-weather-forecast"],
      "env": {
        "API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### Cursor IDE

Add the server to your MCP settings in Cursor:

```json
{
  "mcpServers": {
    "weather": {
      "command": "npx",
      "args": ["mcp-server-weather-forecast"],
      "disabled": false,
      "autoApprove": [],
      "env": {
        "API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### Environment Variables

The following environment variable is required:

- `API_KEY`: Your weather API key for accessing weather services

You can obtain an API key from [OpenWeather](https://docs.openweather.co.uk/)

## Usage

Once configured, you can ask your AI assistant weather-related questions such as:

- "What are the current weather alerts for California?"
- "Get me the weather forecast for New York City"
- "Are there any severe weather warnings in Texas?"
- "What's the forecast for coordinates 40.7128, -74.0060?"

## Available Tools

### `get-alerts`

Get weather alerts for a specific US state.

**Parameters:**
- `state` (string, required): Two-letter US state code (e.g., "CA", "NY", "TX")

**Example:**
```json
{
  "state": "CA"
}
```

### `get-forecast`

Get weather forecast for a specific location using coordinates.

**Parameters:**
- `latitude` (number, required): Latitude of the location (-90 to 90)
- `longitude` (number, required): Longitude of the location (-180 to 180)

**Example:**
```json
{
  "latitude": 37.7749,
  "longitude": -122.4194
}
```

### `current-weather-uk`

Get current weather forecast for UK cities and towns.

**Parameters:**
- `city` (string, required): Name of the UK city or town

**Example:**
```json
{
  "city": "London"
}
```

## API Details

This server uses the following APIs:

- **National Weather Service API**: For US weather alerts and forecasts
- **OpenWeather API**: For UK weather information and additional weather data

**API Key:** An API key is required for accessing weather services. You can obtain one from [OpenWeather](https://docs.openweather.co.uk/)

## Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Running in Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run the server with API key
API_KEY=your-api-key-here node <absolute-path>/build/index.js
```
