import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;
import java.util.ArrayDeque;
import java.util.Collection;
import java.util.Deque;

import javax.swing.Timer;

public class RenderingEngine implements ActionListener{
	private final String windowTitle = "ARProject";
	private BufferedImage currentFrame;
	private Graphics2D currentFrameGraphics;
	private int fps = 30;//TODO this is initialized in the constructor
	private Timer timer;
	private Deque<AREntity> entities = new ArrayDeque<>();
	private boolean mirrored = false;
	private AffineTransform mirrorTransform = new AffineTransform();
	
	private InputHandler inHandler;
	private OutputFrame outFrame;
	private OutputPanel outPanel;//OutputPanel can receive an Image to draw on
	
	public RenderingEngine(InputHandler ih) {
		this(ih, 30);
	}
	
	public RenderingEngine(InputHandler ih, int fps) {
		this.inHandler = ih;
		this.fps = fps;
		
		outPanel = new OutputPanel();//Create a new OutoutPanel to draw on
		timer = new Timer(1000/fps, this);//Set the Timer to repaint according to the fps
		
		BufferedImage bi = ih.getFrame();
		//Set up the BufferedImage to draw on to match the width and height of the input frames.
		currentFrame = new BufferedImage(bi.getWidth(), bi.getHeight(), bi.getType());
		currentFrameGraphics = currentFrame.createGraphics();
		
		//Initialize the mirrorTransform, to flip the image and translate it back into view.
		mirrorTransform.concatenate(AffineTransform.getScaleInstance(-1, 1));
		mirrorTransform.concatenate(AffineTransform.getTranslateInstance(-bi.getWidth(), 0));
	}
	
	//public void setCurrentFrame(BufferedImage bi){}
	public void run(){
		timer.start();
	}
	public void pause(){
		timer.stop();
	}
	
	public void createWindow(){
		if (outFrame == null){
			outFrame = new OutputFrame(windowTitle);
			outFrame.add(outPanel);
			outPanel.setImage(currentFrame);
			outFrame.pack();
		}
	}
	
	public void addAREntity(AREntity are){
		entities.push(are);
	}
	public void addAREntities(Collection<AREntity> ares){
		entities.addAll(ares);
	}
	public boolean removeAREntity(AREntity are){
		return entities.remove(are);
	}
	
	@Override
	public void actionPerformed(ActionEvent evt) {
		//Render the background and all the entities onto the current frame
		render();
		//Repaint the currentFrame onto the outPanel
		outPanel.repaint();
	}
	
	private void render(){
		//Draw the background
		currentFrameGraphics.drawImage(inHandler.getFrame(), 0, 0, currentFrame.getWidth(), currentFrame.getHeight(), null);
		//loop through entities and draw them on the currentFrame;
		for(AREntity are: entities){
			are.draw(currentFrameGraphics);
		}
		/*
		 * if (isMirrored())
			currentFrameGraphics.transform(mirrorTransform);
		currentFrameGraphics.setColor(Color.BLACK);
		//currentFrameGraphics.drawString("Hello World", (int)Math.random()*100, (int)Math.random()*100);
		int x = (int)(Math.random()*100);
		int y = (int)(Math.random()*100);
		currentFrameGraphics.drawString("Hello World", x, y);
		//System.out.printf("Rendering %d %d%n", x, y);
		 * if (isMirrored())
			currentFrameGraphics.transform(mirrorTransform);
		*/
		
	}
	
	public boolean isMirrored(){return mirrored;}
	public void toogleMirror(){//Note before drawing text, unmirror and then remirror using the transform, but do this if only mirrored before.
		mirrored = !mirrored;
		currentFrameGraphics.transform(mirrorTransform);
	}

	
	
	

}
