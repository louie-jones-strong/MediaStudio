class FreehandTool extends Tool
{

	constructor()
	{
		super();
		//set an icon and a name for the object
		this.Name = "Freehand Tool";
		this.Id = "Freehand_Tool";
		this.Icon = "assets/freehandTool.png";

		//to smoothly draw we'll draw a line from the previous mouse location
		//to the current mouse location. The following values store
		//the locations from the last frame. They are -1 to start with because
		//we haven't started drawing yet.
		this.PreviousMouseX = -1;
		this.PreviousMouseY = -1;
	}

	GetFooterHtml()
	{
		var footerHtml = super.GetFooterHtml();

		footerHtml += "<p>Click and drag on the canvas to draw</p>";

		return footerHtml;
	}

	Draw()
	{
		super.Draw();

		//if the mouse is pressed
		if(mouseIsPressed)
		{
			//check if they previousX and Y are -1. set them to the current
			//mouse X and Y if they are.
			if (this.PreviousMouseX == -1)
			{
				this.PreviousMouseX = mousePosX;
				this.PreviousMouseY = mousePosY;
			}
			else
			{
				//if we already have values for previousX and Y we can draw a line from
				//there to the current mouse location
				Layers.CurrentImg.line(this.PreviousMouseX, this.PreviousMouseY, mousePosX, mousePosY);
				this.PreviousMouseX = mousePosX;
				this.PreviousMouseY = mousePosY;
			}
		}
		else
		{
			//if the user has released the mouse we want to set the previousMouse values
			//back to -1.
			//try and comment out these lines and see what happens!
			this.PreviousMouseX = -1;
			this.PreviousMouseY = -1;
		}
	}
}