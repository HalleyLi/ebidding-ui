import Mock from 'mockjs';

Mock.setup({
  timeout: 300,
});


export function intercepter(data: any, listResponse?: boolean) {
  if (listResponse) {
    const result = {
      limit: 1000000,
      offset: 0,
      totalElements: 100,
      totalPages: 100,
      rows: data
    }

    return {
      code: "SUCCESS",
      message: "",
      success: true,
      data: result
    };
  } else {
    return {
      code: "SUCCESS",
      message: "",
      success: true,
      data
    };
  }
}

export const mock = Mock;
