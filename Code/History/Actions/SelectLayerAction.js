class SelectLayerAction extends BaseAction
{
	constructor(fromIndex, toIndex)
	{
		super("", "");

		this.FromIndex = fromIndex;
		this.ToIndex = toIndex;
		this.EndAction();
	}

	Undo()
	{
		Layers.SelectIndex(this.FromIndex, false);
	}

	Redo()
	{
		Layers.SelectIndex(this.ToIndex, false);
	}
}