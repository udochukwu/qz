# CourseGPTFrontend

## Requirements

- Node.js >= 20.11.1
- pnpm >= 9.8.0

### Configuration

Run and complete the configuration in the `.env` file:

```bash
cp .env.example .env
```

### Running

If you are using M1:

```bash
brew install pkg-config cairo pango
```

For everyone, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Production configuration

#### Feedback Google Forms

Using "Google Forms as a feedback-Service" is a hacky solution. You can get a CSP and CORS errors not knowing it's not the real problem.

To get Forms working correctly you need to:

1. Create a new form with chosen options
2. Click the `Get pre-filled link` button from settings
3. Write anything in every input
4. Copy URL somewhere in the code and check for a few things
5. The `entry.<number>` like `entry.12491683139` is an id of the chosen input. You need it to set up the `name` attribute of the hidden input inside the form
6. For a radio group/select component the value of the form option is identical to its label. For example: the option `Too Expensive` has value: `Too Expensive`. Probably, you'll need to change `+` characters from the URL to the whitespaces again.
