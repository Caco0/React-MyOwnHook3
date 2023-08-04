import { useCallback, useEffect, useState } from 'react';
import './App.css';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

const useAsync = (asyncFunction, shouldRun) => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('idle');

  const run = useCallback(async () => {
    console.log('EFFECT', new Date().toLocaleDateString());
    setResult(null);
    setError(null);
    await new Promise((r) => setTimeout(r, 2000));
    setStatus('pending');

    return asyncFunction()
      .then((response) => {
        setResult(response);
        setStatus('settled');
      })
      .catch((error) => {
        setError(error);
        setStatus('error');
      });
  }, [asyncFunction]);

  useEffect(() => {
    if (shouldRun) {
      run();
    }
  }, [run, shouldRun]);
  return [run, result, error, status];
};

const fetchData = async () => {
  await new Promise((r) => setTimeout(r, 2000));
  const data = await fetch('https://jsonplaceholder.typicode.com/posts');
  const json = await data.json();

  return json;
};

function App() {
  const [posts, setPosts] = useState(null);
  const [reFetchData, result, error, status] = useAsync(fetchData, true);
  if (status === 'idle') {
    return (
      <>
        <h3>
          <pre>
            {' '}
            <strong style={{ fontSize: '3rem' }}>Nada Executado</strong>{' '}
          </pre>
        </h3>
      </>
    );
  }
  if (status === 'pending') {
    return (
      <>
        <h3>
          <pre>
            <strong style={{ color: 'red', fontSize: '3rem' }}>
              Loading...
            </strong>
          </pre>
        </h3>
      </>
    );
  }
  if (status === 'error') {
    return (
      <>
        <h3>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </h3>
      </>
    );
  }
  if (status === 'settled') {
    return (
      <>
        <div>
          <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noreferrer">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React My Own Hook 3</h1>
        <h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </h3>
      </>
    );
  }
  return 'VISH';
}

export default App;
