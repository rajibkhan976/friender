const SettingLoader = () => {
    return (
        <div className="page-loader-mainSpace settings-loader d-flex d-flex-column">
            <div className='page-loader-tableHeader  d-flex f-justify-between'>
                <span className="skeleton-loader closed-settings"></span>
                <span className="skeleton-loader closed-settings"></span>
                <span className="skeleton-loader closed-settings"></span>
                <span className="skeleton-loader opened-settings"></span>
                <span className="skeleton-loader opened-settings"></span>
                <span className="skeleton-loader opened-settings"></span>
            </div>
        </div>
    );
};

export default SettingLoader;