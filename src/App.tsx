
import { BrowserRouter as Router } from 'react-router-dom';
import { GlobalProviders } from './providers/GlobalProviders';
import { AppRouter } from './utils/router';

export const App = (): JSX.Element => {
  return (
    <Router>
      <GlobalProviders>
        <AppRouter />
      </GlobalProviders>
    </Router>
  );
};
