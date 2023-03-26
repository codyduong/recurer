import { useAuth } from 'packages/auth/AuthContext';

const Dashboard = (): JSX.Element => {
  const { setToken } = useAuth();

  return (
    <div>
      <button
        onClick={() => {
          setToken(null);
        }}
      >
        Sign out
      </button>
      <span>Dashboard</span>
      <p>Some cool text</p>
    </div>
  );
};

export default Dashboard;
