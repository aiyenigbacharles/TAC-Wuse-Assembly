import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import PageHeader from "@/components/PageHeader";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <PageHeader label="404" title="This page has wandered off.">
        <p>The page you are looking for does not exist or has moved.</p>
      </PageHeader>
      <div className="container pb-32">
        <Link to="/" className="btn btn-primary">
          Back to home
        </Link>
      </div>
    </>
  );
};

export default NotFound;
