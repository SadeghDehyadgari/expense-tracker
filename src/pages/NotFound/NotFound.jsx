import './NotFound.css';

const NotFound = () => {
  return (
    <div className="notfound-page">
      <div className="notfound-card">
        <img src="/rafiki.svg" alt="صفحه مورد نظر یافت نشد" className="notfound-image" />
        <h1 className="notfound-title">صفحه مورد نظر پیدا نشد!</h1>
      </div>
    </div>
  );
};

export default NotFound;
