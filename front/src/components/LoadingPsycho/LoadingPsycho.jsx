import './index.css'

function LoadingPsycho (){
    return(
        <div className="psycho_card loading_psycho">
            <div className="psycho_card--loading_image">
                <div className="loading_image--image"></div>
                <div className="loading_image--text"></div>
            </div>

            <div className="psycho_card--loading_description">
                <div className="loading_description--name"></div>
                <div className="loading_description--description"></div>
            </div>
        </div>
    )
}

export default LoadingPsycho