import { useCallback, useEffect, useState } from 'react';
import './App.css';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

const useAsync = (asyncFunction, shouldRun) => {
  const [state, setState] = useState({
    result: null,
    error: null,
    status: 'idle',
  });

  const run = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 2000));

    setState({
      result: null,
      error: null,
      status: 'pending',
    });

    await new Promise((r) => setTimeout(r, 2000));

    return asyncFunction()
      .then((response) => {
        setState({
          result: response,
          error: null,
          status: 'settled',
        });
      })
      .catch((err) => {
        setState({
          result: null,
          error: err,
          status: 'error',
        });
      });
  }, [asyncFunction]);

  useEffect(() => {
    if (shouldRun) {
      run();
    }
  }, [run, shouldRun]);
  return [run, state.result, state.error, state.status];
};

const fetchData = async () => {
  // throw new Error('Que chato!');
  await new Promise((r) => setTimeout(r, 2000));
  const data = await fetch('https://jsonplaceholder.typicode.com/posts');
  const json = await data.json();

  return json;
};

function App() {
  const [posts, setPosts] = useState(null);
  const [reFetchData, result, error, status] = useAsync(fetchData, true);
  const [reFetchData2, result2, error2, status2] = useAsync(fetchData, true);

  useEffect(() => {
    setTimeout(() => {
      reFetchData();
    }, 6000);
    reFetchData();
  }, [reFetchData]);

  useEffect(() => {
    console.log(result2);
  }, [result2]);

  function handleClick() {
    reFetchData();
  }

  if (status === 'idle') {
    return (
      <>
        <h3>
          <pre>
            {' '}
            <strong style={{ fontSize: '3rem' }}>
              idle: Nada Executado
            </strong>{' '}
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
              pending: Loading...
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
          <pre>error: {error.message}</pre>
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
          <pre onClick={handleClick}>
            {' '}
            settled: {JSON.stringify(result, null, 2)}
          </pre>
        </h3>
      </>
    );
  }
  return 'VISH';
}

export default App;
