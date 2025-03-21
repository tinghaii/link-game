# Link Game

A multiplayer Link Game built with Node.js and Socket.IO.

## Features

- Classic Link Game gameplay
- Real-time multiplayer battles
- Time and scoring system
- Beautiful interface design
- Hint feature (in development)

## Tech Stack

- Backend: Node.js, Express, Socket.IO
- Frontend: HTML5 Canvas, JavaScript
- Styling: CSS3

## Installation

1. Clone repository:
```bash
git clone https://github.com/tinghaii/link-game.git
```

2. Install dependencies:
```bash
npm install
```

3. Run the game:
```bash
npm start
```

4. Access in browser:
```
http://localhost:3000
```

## Game Rules

1. Click any two identical tiles
2. If the two tiles can be connected with no more than three straight lines and the path has no other tiles, they will be eliminated
3. Eliminate all tiles to win
4. Score is calculated based on elimination speed and remaining time

## Development Guide

### Project Structure

```
/link-game
  /src
    /server         # Server-side code
    /client
      /js           # Client-side JavaScript
      /css          # Stylesheets
      /assets       # Images and other resources
    /config         # Configuration files
```

### Development Mode

Run the development server:
```bash
npm run dev
```

### Testing

Run tests:
```bash
npm test
```

## Contribution Guide

1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT