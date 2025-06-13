import Alert from "./Alert";

function AlertContainer({ alerts }) {
    return (
        <div className="alert_container">
            {alerts.map((alert) => (
                <Alert key={alert.id} type={alert.type}>
                    {alert.message}
                </Alert>
            ))}
        </div>
    );
}

export default AlertContainer;