import javax.swing.JFrame;
import java.awt.image.BufferedImage;

public class OutputFrame extends JFrame{
	//private OutputPanel outpanel = new OutputPanel();
	
	OutputFrame(String title){
		super(title);
		setDefaultCloseOperation(EXIT_ON_CLOSE);
		setSize(500, 500);
		setResizable(false);
		//this.setIconImage(image);//TODO put icon image here?
		//outpanel.setImage(initImg);
		//add(outpanel);
		
		
		setVisible(true);
	}
	/*
	public void setImage(BufferedImage bi){
		outpanel.setImage(bi);
		pack();//TODO This is tmp, make this set once when the first images is loaded or something somehow.
		outpanel.repaint();//TODO this will not be needed when a timer is in use on the OutputPanel
	}*/
}
