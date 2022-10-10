import * as Jimp from "jimp";
import { Tensor } from "onnxruntime-web";

export const imageTensor = async (
  imageDataUrl: string,
  dims: number[] = [1, 3, 224, 224]
): Promise<Tensor> => {
  const image = await loadImage(imageDataUrl, dims[2], dims[3]);
  // 2. convert to tensor
  const tensor = imageDataToTensor(image, dims);
  // 3. return the tensor
  return tensor;
};

const loadImage = async (
  imageDataUrl: string,
  width: number = 224,
  height: number = 224
) => {
  const image = await Jimp.default.read(imageDataUrl);
  return image.resize(width, height);
};

const imageDataToTensor = (image: Jimp, dims: number[]): Tensor => {
  const imageData = image.bitmap.data;
  const [r, g, b] = [
    new Array<number>(),
    new Array<number>(),
    new Array<number>(),
  ];

  for (let i = 0; i < imageData.length; i += 4) {
    r.push(imageData[i]);
    g.push(imageData[i + 1]);
    b.push(imageData[i + 2]);
    // skip data[i + 3] to filter out the alpha channel
  }

  const transposedData = r.concat(g).concat(b);
  const float32Data = new Float32Array(dims[1] * dims[2] * dims[3]);
  for (let i = 0; i < transposedData.length; i++) {
    float32Data[i] = transposedData[i]; // convert to float
  }

  const inputTensor = new Tensor("float32", float32Data, dims);
  return inputTensor;
};
