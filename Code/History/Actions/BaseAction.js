class BaseAction
{
	constructor()
	{
		this.Icon = "";
		this.Name = "";
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