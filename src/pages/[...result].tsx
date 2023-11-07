import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Layout } from "~/components/Shared/Layout";

const Success = () => {
  const { query } = useRouter();

  return (
    <>
      <Layout>
        <div className="mt-[25vh] flex w-full justify-center">
          <div className="card w-96 max-w-md shadow">
            <div className="card-body items-center">
              <h1 className="text-5xl font-bold text-success">{query.title}</h1>
              <p>{query.content}</p>
              <Link
                href={
                  query.backPath == undefined ? "/" : (query.backPath as string)
                }
                className="btn-primary rounded-box btn"
              >
                Back
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Success;
