function PanelHeader({ title, description, action }) {
  return (
    <div className="panel-heading">
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      {action}
    </div>
  )
}

export default PanelHeader
