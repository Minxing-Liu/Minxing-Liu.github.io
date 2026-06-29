\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{main}[2026/06/20 Undergraduate thermal and statistical physics notes]

\LoadClass[zihao=5,a4paper,oneside]{ctexrep}

\RequirePackage[left=1.55cm,right=1.55cm,top=1.85cm,bottom=1.85cm]{geometry}
\RequirePackage{amsmath,amssymb,bm,mathtools}
\RequirePackage{booktabs,longtable,array}
\RequirePackage{xcolor}
\RequirePackage{enumitem}
\RequirePackage{fancyhdr}
\RequirePackage[hidelinks]{hyperref}

\definecolor{noteink}{HTML}{17202A}
\definecolor{notemuted}{HTML}{667085}
\definecolor{noteaccent}{HTML}{16706B}
\definecolor{notewarm}{HTML}{B86F22}
\definecolor{noteline}{HTML}{D9E2DF}

\hypersetup{
  pdftitle={Thermodynamics and Statistical Physics Review Notes},
  pdfauthor={Minxing Liu},
  pdfsubject={Undergraduate thermal and statistical physics review},
  pdfkeywords={thermodynamics, statistical physics, qualifying exam}
}

\pagestyle{fancy}
\fancyhf{}
\lhead{\small 热力学与统计物理基础笔记}
\rhead{\small \leftmark}
\cfoot{\small \thepage}
\renewcommand{\headrulewidth}{0.4pt}

\setlist[itemize]{leftmargin=1.7em,itemsep=0.25em,topsep=0.35em}
\setlist[enumerate]{leftmargin=1.9em,itemsep=0.25em,topsep=0.35em}
\setlength{\parindent}{2em}
\setlength{\parskip}{0.25em}

\newcommand{\dd}{\mathrm{d}}
\newcommand{\kb}{k_{\mathrm B}}
\newcommand{\avg}[1]{\left\langle #1 \right\rangle}
\newcommand{\pd}[2]{\left(\frac{\partial #1}{\partial #2}\right)}
\newcommand{\pdc}[3]{\left(\frac{\partial #1}{\partial #2}\right)_{#3}}
\newcommand{\Z}{\mathcal Z}
\newcommand{\micro}{\Omega}

\newenvironment{keybox}
  {\begin{center}\begin{minipage}{0.94\textwidth}\hrule\vspace{0.45em}\small}
  {\vspace{0.45em}\hrule\end{minipage}\end{center}}

\newcommand{\sourceNote}[1]{%
  \begin{keybox}
  \textbf{Source note.} #1
  \end{keybox}
}
