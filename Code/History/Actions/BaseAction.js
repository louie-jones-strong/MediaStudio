class BaseAction
{
	static CreatedActions = 0;

	constructor(icon="", name="")
	{
		this.Id = `Action_${BaseAction.CreatedActions}`
		this.Icon = icon;
		this.Name = name;
		this.Ended = false;
		BaseAction.CreatedActions += 1;

		let action = createDiv(`<img class="actionIcon" src="${this.Icon}"><p>${this.Name}</p>`);
		action.id(this.Id);
		action.parent(select("#historyListHolder"));
		action.class("action")
	}

	Remove()
	{
		select(`#${this.Id}`).remove()
	}

	EndAction()
	{
		this.Ended = true;
	}

	SetIsCurrent(isCurrent)
	{

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