# Detox Residential Treatment Billing Analyzer

A professional internal billing tool for estimating detox residential treatment services, payer responsibility, and patient cost share based on insurance policy details.

## Features

✨ **Comprehensive Billing Analysis**

- Calculate patient and payer responsibility
- Support for multiple ASAM levels of care
- Real-time calculation as you type
- Multiple billable service codes

💼 **Professional Features**

- Export billing analysis to text file
- Print-friendly layout for PDF generation
- Responsive design for mobile and desktop
- Smooth animations and transitions

🏥 **Healthcare-Specific**

- ASAM 3.7-WM, 3.2-WM, and 3.5 levels
- Common billing codes (H0010, H0001, T1019, etc.)
- Deductible, coinsurance, and copay calculations
- Network status adjustments

## Usage

### Running Locally

Simply open `index.html` in your web browser. No build process or dependencies required!

Alternatively, you can use a local server:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js (if you have npx)
npx serve

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000` in your browser.

### Deploying to GitHub Pages

This repository is already set up for GitHub Pages deployment:

1. Push your changes to the `main` branch
2. Go to your repository settings on GitHub
3. Navigate to "Pages" in the left sidebar
4. Under "Source", select the `main` branch
5. Click "Save"
6. Your site will be live at `https://bozzin.github.io/`

## How It Works

1. **Enter Client & Policy Details**: Input patient information, insurance plan type, network status, and authorization details
2. **Configure Cost Share**: Set deductible, out-of-pocket maximum, coinsurance percentage, and copay amounts
3. **Select Billable Services**: Toggle services and adjust units/rates as needed
4. **Analyze**: The tool automatically calculates patient and payer responsibility
5. **Export**: Download a formatted text file with the complete billing analysis

## File Structure

```
bozzin.github.io/
├── index.html      # Main HTML structure
├── styles.css      # All styling and responsive design
├── app.js          # Billing calculation logic
└── README.md       # This file
```

## Technical Details

- **Pure HTML/CSS/JavaScript** - No frameworks or build tools required
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Print Optimized** - Generate professional PDFs using browser print
- **Accessibility** - Proper focus states and semantic HTML
- **Modern Fonts** - Uses Inter font family from Google Fonts

## Compliance Notes

⚠️ **Important**: This tool provides estimates for internal use only.

- Always confirm benefits with the payer before billing
- Verify authorization requirements
- Reconcile rates with actual contract allowed amounts
- Use accurate clinical documentation and medical necessity criteria
- Actual payment may vary based on payer adjudication

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Internal use only. Not for distribution.

---

**Last Updated**: January 2026
