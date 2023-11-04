import BasicLayout from '../../layouts/basic-layout';

export function NotFound() {
  return (
    <BasicLayout>
      <div className="flex bg-white place-content-center">
        <div className="m-auto text-center">
          <h1 className="font-black text-red-200 text-9xl">404</h1>
          <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Ôi không!
          </p>
          <p className="mt-4 text-gray-500">
            Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <a
            href="/"
            className="inline-block px-5 py-3 mt-6 text-sm font-medium text-white rounded bg-japonica-600 hover:bg-indigo-700 focus:outline-none focus:ring"
          >
            Quay lại trang chủ
          </a>
        </div>
      </div>
    </BasicLayout>
  );
}
