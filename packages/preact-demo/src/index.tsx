import { render } from 'preact';
import App from './App_preact_signals';

const root = document.getElementById('root');
if (root) {
  render(<App />, root);
}
