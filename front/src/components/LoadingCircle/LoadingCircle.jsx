import './index.css'

function LoadingCircle() {
    return (
        <div id="circle_box">
            <div className="container-loader">
                <div className="circle"></div>
            </div>
            <div className="loading">Cargando...</div>
        </div>
    )
}

export default LoadingCircle