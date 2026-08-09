export type ApiResponse<T> = {
  success: true;
  data: T;
};

export const apiResponse = <T>(data: T): ApiResponse<T> => ({
  success: true,
  data,
});
