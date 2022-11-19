class ActionsManger
{
	constructor()
	{

	}

	DoActions(actions)
	{
		for (let i = 0; i < actions.length; i++)
		{
			const action = actions[i];
			this.DoAction(action);
		}
	}

	DoAction(action)
	{
		switch (action.Type)
		{
			case "SelectTool":
			{
				ToolManager.SelectTool(action.ToolId)
				break;
			}
			case "SetColour":
			{
				this.SetColorAction(action)
				break;
			}
			case "MousePos":
			{
				MousePosX = action.PixelsX;
				MousePosY = action.PixelsY;
				break;
			}
			case "Keys":
			{
				this.KeysAction(action)
				break;
			}
			case "MouseDown":
			{
				MouseLeftOrRightDown = true;
				break;
			}
			case "MouseUp":
			{
				MouseLeftOrRightDown = false;
				break;
			}
			default:
			{
				console.error("unknown action" + action);
				break;
			}
		}

		this.Update()
	}

	Update()
	{
		ColorP.UpdateColors();
		//call the draw function on the selected tool
		ToolManager.Draw();

		RenderImage();
	}

	SetColorAction(action)
	{
		let r = 255;
		if (action.ColourR != null)
			r = action.ColourR;

		let g = 255;
		if (action.ColourG != null)
			g = action.ColourG;

		let b = 255;
		if (action.ColourB != null)
			b = action.ColourB;

		let a = 255;
		if (action.ColourA != null)
			a = action.ColourA;

		ColorP.LeftClickColor.SetColor(color(r, g, b, a));
	}

	KeysAction(action)
	{
		let text = Template.GetInput(action.KeysInput)

		if (text == null)
			text = action.Keys;

		for (let i = 0; i < text.length; i++)
		{
			const char = text[i];

			let code = char.toUpperCase().charCodeAt(0)
			ToolManager.KeyTyped(char, code);
			this.Update()
		}
	}
}