import 'zone.js/node';
import express from 'express';
import { join } from 'path';
import { renderApplication } from '@angular/platform-server';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './src/app/app.component';
import { routes } from './src/app/app.routes';

const server = express();
const browserDistFolder = join(process.cwd(), 'dist/story-project/browser');

server.use(express.static(browserDistFolder, { maxAge: '1y' }));

server.get('*', async (req, res, next) => {
  try {
    const html = await renderApplication(
      () => bootstrapApplication(AppComponent, {
        providers: [
          provideRouter(routes),
          provideHttpClient(),
        ],
      }),
      {} // ✅ Fixed: Provide an empty object as the second argument
    );

    res.status(200).send(html);
  } catch (err) {
    next(err);
  }
});

function run(): void {
  const port = process.env['PORT'] || 4000;
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
