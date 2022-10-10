import * as ort from "onnxruntime-web";
import useSWR from "swr";

export const useModel = () => {
  return useSWR("./_next/static/chunks/pages/squeezenet.onnx", (model) =>
    ort.InferenceSession.create(model, {
      executionProviders: ["wasm"],
      graphOptimizationLevel: "all",
    })
  );
};
