class SelectLayerAction extends BaseAction
{
	constructor(fromIndex, toIndex)
	{
		super("assets/layer.png", "Select Layer");

		this.FromIndex = fromIndex;
		this.ToIndex = toIndex;
		this.EndAction();
	}

	Undo()
	{
		super.Undo()
		Layers.SelectIndex(this.FromIndex, false);
	}

	Redo()
	{
		super.Redo()
		Layers.SelectIndex(this.ToIndex, false);
	}
}