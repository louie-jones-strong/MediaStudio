//container object for storing the tools. Functions to add new tools and select a tool
class Toolbox
{
	constructor()
	{
		this.Tools = [];
		this.SelectedTool = null;
	}


	Draw()
	{
		if (this.SelectedTool != null)
		{
			this.SelectedTool.Draw();
		}
	}

	KeyPressed(key, keyCode)
	{
		if (this.SelectedTool != null)
		{
			this.SelectedTool.KeyPressed(key, keyCode);
		}
	}

	KeyReleased(key, keyCode)
	{
		if (this.SelectedTool != null)
		{
			this.SelectedTool.KeyReleased(key, keyCode);
		}
	}

	KeyTyped(key, keyCode)
	{
		if (this.SelectedTool != null)
		{
			this.SelectedTool.KeyTyped(key, keyCode);
		}
	}


	ToolbarItemClick()
	{
		let toolId = this.id().split("iconButton")[0];
		ToolManager.SelectTool(toolId);
	}

	//add a new tool icon to the html page
	AddToolIcon(icon, name)
	{
		let iconButton = createDiv("<img src='" + icon + "'></div>");
		iconButton.class('iconButton');
		iconButton.id(name + "iconButton");
		iconButton.parent('toolListHolder');
		iconButton.mouseClicked(this.ToolbarItemClick);
	}

	//add a tool to the tools array
	AddTool(tool)
	{
		this.Tools.push(tool);
		this.AddToolIcon(tool.Icon, tool.Id);
		//if no tool is selected (ie. none have been added so far)
		//make this tool the selected one.
		if (this.SelectedTool == null)
		{
			this.SelectTool(tool.Id);
		}
	}

	SelectTool(toolId)
	{
		if (this.SelectedTool != null)
		{
			this.SelectedTool.UnselectTool();
			this.SelectedTool = null
		}

		let items = selectAll(".iconButton");

		//search through the tools for one that's name matches toolName
		for (let i = 0; i < this.Tools.length; i++)
		{
			//remove selected styling from all tools
			items[i].class("iconButton");
			if (this.Tools[i].Id == toolId)
			{
				//select the tool and highlight it on the toolbar
				this.SelectedTool = this.Tools[i];
				select("#" + toolId + "iconButton").class("iconButton selected");

				this.SelectedTool.SelectTool();
			}
		}
		//call loadPixels to make sure most recent changes are saved to pixel array
		Layers.CurrentImg.loadPixels();
	}

	Reset()
	{
		if(this.Tools.length == 0)
		{
			return
		}

		this.SelectTool(this.Tools[0].Id);
	}
}