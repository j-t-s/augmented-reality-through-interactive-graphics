import java.awt.Component;
import java.awt.Graphics2D;
//import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

import javax.swing.JFileChooser;
import javax.swing.filechooser.FileNameExtensionFilter;
/**
 * 
 * 
 * Note: The ImageHolder must be initialized, in order for getFrame() to work.
 * loadWebcam() and loadFile() initialize imgHolder.
 *
 */
public class InputHandler {
	private ImageHolder imgHolder;
	private Component parent;
	
	InputHandler(Component parent){
		this.parent = parent;
	}
	
	public void loadWebcam(){
		loadWebcam(0);
	}
	public void loadWebcam(int deviceNumber){
		imgHolder = new Webcam(deviceNumber);
	}
	
	public void loadFile(){
		JFileChooser chooser = new JFileChooser();
		//String absFilePath;
		//Be only able to choose files with common image filename extensions.
		FileNameExtensionFilter fnef = new FileNameExtensionFilter("JPG, GIF, PNG, and BMP Images","jpg","gif","png","bmp");
		chooser.setFileFilter(fnef);
		
		int retVal = chooser.showOpenDialog(parent);
		
		if (retVal == JFileChooser.APPROVE_OPTION){
			//absFilePath = chooser.getSelectedFile().getAbsolutePath();
			//loadFile(absFilePath);
			loadFile(chooser.getSelectedFile().getAbsolutePath());
		}
	}
	public void loadFile(String filePath){
		try {
			imgHolder = new ImageHolder(){//Make the ImageHolder hold the image file
				BufferedImage img = javax.imageio.ImageIO.read(new File(filePath));
				//Make the image the standard 4 byte ABGR
				BufferedImage stdImg = new BufferedImage(img.getWidth(), img.getHeight(), BufferedImage.TYPE_4BYTE_ABGR);
				Graphics2D g2 = stdImg.createGraphics();
				{
					//g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_OFF);
					//System.out.println(g2.getRenderingHint(RenderingHints.KEY_INTERPOLATION));
					//g2.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BICUBIC);
					g2.drawImage(img, 0, 0, null);//Draw the image onto the standard BufferedImage.
					g2.dispose();
				}
				
				@Override
				public BufferedImage getCurrentFrame() {//Return a reference to the buffered image
					return stdImg;
					//return img;
				}
			};
		} catch (IOException e) {//TODO add a MessageBox that shows this to the user as well.
			System.err.println("Could not load image file: "+filePath);
		}
	}
	
	public BufferedImage getFrame(){
		//If the imgHolder does not have content, return null
		if (imgHolder == null)
			return null;
		//Else return the current frame of the Image Holder.
		return imgHolder.getCurrentFrame();
	}
}
