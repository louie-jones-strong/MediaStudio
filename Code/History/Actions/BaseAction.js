class BaseAction
{
	constructor(icon="", name="")
	{
		this.Icon = icon;
		this.Name = name;
		this.Ended = false;
	}

	EndAction()
	{
		this.Ended = true;
	}

	Undo()
	{

	}

	Redo()
	{
		if (!this.Ended)
		{
			console.log("Redo called on a ended action");
		}
	}
}