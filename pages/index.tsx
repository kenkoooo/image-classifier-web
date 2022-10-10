import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { InferenceSession, Tensor } from "onnxruntime-web";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { readFile } from "../utils/file";
import { imageTensor } from "../utils/image";
import { useModel } from "../utils/model";

const Home: NextPage = () => {
  const model = useModel()?.data;
  const [tensor, setTensor] = useState<Tensor>();
  const result = useResult(model, tensor);
  const data = result?.data;

  return (
    <div>
      <input
        type="file"
        onChange={async (e) => {
          const file = e.target?.files?.item(0);
          if (file) {
            const buf = await readFile(file);
            const tensor = await imageTensor(buf);
            setTensor(tensor);
          }
        }}
      />
      {data && <p>{JSON.stringify(data)}</p>}
    </div>
  );
};

export default Home;

const useResult = (model?: InferenceSession, tensor?: Tensor) => {
  const [result, setResult] = useState<Tensor>();
  useEffect(() => {
    if (model && tensor) {
      const feeds: Record<string, Tensor> = {};
      feeds[model.inputNames[0]] = tensor;
      model.run(feeds).then((result) => {
        const output = result[model.outputNames[0]];
        setResult(output);
      });
    }
  }, [model, tensor]);
  return result;
};
