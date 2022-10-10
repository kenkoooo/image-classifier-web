import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Tensor } from "onnxruntime-web";
import { useMemo, useState } from "react";
import useSWR from "swr";
import { readFile } from "../utils/file";
import { imageTensor } from "../utils/image";
import { useModel } from "../utils/model";

const Home: NextPage = () => {
  const model = useModel()?.data;
  const [tensor, setTensor] = useState<Tensor>();

  const result = useMemo(async () => {
    if (model && tensor) {
      const feeds: Record<string, Tensor> = {};
      feeds[model.inputNames[0]] = tensor;
      const result = await model.run(feeds);
      const output = result[model.outputNames[0]];
      console.log(output);
      return result;
    }
  }, [model, tensor]);

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
    </div>
  );
};

export default Home;
