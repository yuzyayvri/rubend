import Base
import ./model.bend as M

type Symmetry is Data:
  S0{}
  S1{}
  S2{}
  S3{}
  S4{}
  S5{}
  S6{}
  S7{}
  S8{}
  S9{}
  S10{}
  S11{}
  S12{}
  S13{}
  S14{}
  S15{}
  S16{}
  S17{}
  S18{}
  S19{}
  S20{}
  S21{}
  S22{}
  S23{}
  S24{}
  S25{}
  S26{}
  S27{}
  S28{}
  S29{}
  S30{}
  S31{}
  S32{}
  S33{}
  S34{}
  S35{}
  S36{}
  S37{}
  S38{}
  S39{}
  S40{}
  S41{}
  S42{}
  S43{}
  S44{}
  S45{}
  S46{}
  S47{}

def identity() -> Symmetry:
  S0{}

def index(sym: Symmetry) -> U32:
  match sym:
    case S0{}:
      0
    case S1{}:
      1
    case S2{}:
      2
    case S3{}:
      3
    case S4{}:
      4
    case S5{}:
      5
    case S6{}:
      6
    case S7{}:
      7
    case S8{}:
      8
    case S9{}:
      9
    case S10{}:
      10
    case S11{}:
      11
    case S12{}:
      12
    case S13{}:
      13
    case S14{}:
      14
    case S15{}:
      15
    case S16{}:
      16
    case S17{}:
      17
    case S18{}:
      18
    case S19{}:
      19
    case S20{}:
      20
    case S21{}:
      21
    case S22{}:
      22
    case S23{}:
      23
    case S24{}:
      24
    case S25{}:
      25
    case S26{}:
      26
    case S27{}:
      27
    case S28{}:
      28
    case S29{}:
      29
    case S30{}:
      30
    case S31{}:
      31
    case S32{}:
      32
    case S33{}:
      33
    case S34{}:
      34
    case S35{}:
      35
    case S36{}:
      36
    case S37{}:
      37
    case S38{}:
      38
    case S39{}:
      39
    case S40{}:
      40
    case S41{}:
      41
    case S42{}:
      42
    case S43{}:
      43
    case S44{}:
      44
    case S45{}:
      45
    case S46{}:
      46
    case S47{}:
      47

def from_index(index: U32) -> Maybe<&2, Symmetry>:
  match index:
    case 0:
      Some{S0{}}
    case 1:
      Some{S1{}}
    case 2:
      Some{S2{}}
    case 3:
      Some{S3{}}
    case 4:
      Some{S4{}}
    case 5:
      Some{S5{}}
    case 6:
      Some{S6{}}
    case 7:
      Some{S7{}}
    case 8:
      Some{S8{}}
    case 9:
      Some{S9{}}
    case 10:
      Some{S10{}}
    case 11:
      Some{S11{}}
    case 12:
      Some{S12{}}
    case 13:
      Some{S13{}}
    case 14:
      Some{S14{}}
    case 15:
      Some{S15{}}
    case 16:
      Some{S16{}}
    case 17:
      Some{S17{}}
    case 18:
      Some{S18{}}
    case 19:
      Some{S19{}}
    case 20:
      Some{S20{}}
    case 21:
      Some{S21{}}
    case 22:
      Some{S22{}}
    case 23:
      Some{S23{}}
    case 24:
      Some{S24{}}
    case 25:
      Some{S25{}}
    case 26:
      Some{S26{}}
    case 27:
      Some{S27{}}
    case 28:
      Some{S28{}}
    case 29:
      Some{S29{}}
    case 30:
      Some{S30{}}
    case 31:
      Some{S31{}}
    case 32:
      Some{S32{}}
    case 33:
      Some{S33{}}
    case 34:
      Some{S34{}}
    case 35:
      Some{S35{}}
    case 36:
      Some{S36{}}
    case 37:
      Some{S37{}}
    case 38:
      Some{S38{}}
    case 39:
      Some{S39{}}
    case 40:
      Some{S40{}}
    case 41:
      Some{S41{}}
    case 42:
      Some{S42{}}
    case 43:
      Some{S43{}}
    case 44:
      Some{S44{}}
    case 45:
      Some{S45{}}
    case 46:
      Some{S46{}}
    case 47:
      Some{S47{}}
    case _: None{}

def inverse(sym: Symmetry) -> Symmetry:
  match sym:
    case S0{}:
      S0{}
    case S1{}:
      S1{}
    case S2{}:
      S2{}
    case S3{}:
      S3{}
    case S4{}:
      S4{}
    case S5{}:
      S5{}
    case S6{}:
      S6{}
    case S7{}:
      S7{}
    case S8{}:
      S8{}
    case S9{}:
      S9{}
    case S10{}:
      S12{}
    case S11{}:
      S13{}
    case S12{}:
      S10{}
    case S13{}:
      S11{}
    case S14{}:
      S14{}
    case S15{}:
      S15{}
    case S16{}:
      S16{}
    case S17{}:
      S18{}
    case S18{}:
      S17{}
    case S19{}:
      S19{}
    case S20{}:
      S20{}
    case S21{}:
      S22{}
    case S22{}:
      S21{}
    case S23{}:
      S23{}
    case S24{}:
      S32{}
    case S25{}:
      S34{}
    case S26{}:
      S36{}
    case S27{}:
      S38{}
    case S28{}:
      S33{}
    case S29{}:
      S35{}
    case S30{}:
      S37{}
    case S31{}:
      S39{}
    case S32{}:
      S24{}
    case S33{}:
      S28{}
    case S34{}:
      S25{}
    case S35{}:
      S29{}
    case S36{}:
      S26{}
    case S37{}:
      S30{}
    case S38{}:
      S27{}
    case S39{}:
      S31{}
    case S40{}:
      S40{}
    case S41{}:
      S44{}
    case S42{}:
      S42{}
    case S43{}:
      S46{}
    case S44{}:
      S41{}
    case S45{}:
      S45{}
    case S46{}:
      S43{}
    case S47{}:
      S47{}

def compose(left: Symmetry, right: Symmetry) -> Symmetry:
  match left right:
    case S0{} S0{}:
      S0{}
    case S0{} S1{}:
      S1{}
    case S0{} S2{}:
      S2{}
    case S0{} S3{}:
      S3{}
    case S0{} S4{}:
      S4{}
    case S0{} S5{}:
      S5{}
    case S0{} S6{}:
      S6{}
    case S0{} S7{}:
      S7{}
    case S0{} S8{}:
      S8{}
    case S0{} S9{}:
      S9{}
    case S0{} S10{}:
      S10{}
    case S0{} S11{}:
      S11{}
    case S0{} S12{}:
      S12{}
    case S0{} S13{}:
      S13{}
    case S0{} S14{}:
      S14{}
    case S0{} S15{}:
      S15{}
    case S0{} S16{}:
      S16{}
    case S0{} S17{}:
      S17{}
    case S0{} S18{}:
      S18{}
    case S0{} S19{}:
      S19{}
    case S0{} S20{}:
      S20{}
    case S0{} S21{}:
      S21{}
    case S0{} S22{}:
      S22{}
    case S0{} S23{}:
      S23{}
    case S0{} S24{}:
      S24{}
    case S0{} S25{}:
      S25{}
    case S0{} S26{}:
      S26{}
    case S0{} S27{}:
      S27{}
    case S0{} S28{}:
      S28{}
    case S0{} S29{}:
      S29{}
    case S0{} S30{}:
      S30{}
    case S0{} S31{}:
      S31{}
    case S0{} S32{}:
      S32{}
    case S0{} S33{}:
      S33{}
    case S0{} S34{}:
      S34{}
    case S0{} S35{}:
      S35{}
    case S0{} S36{}:
      S36{}
    case S0{} S37{}:
      S37{}
    case S0{} S38{}:
      S38{}
    case S0{} S39{}:
      S39{}
    case S0{} S40{}:
      S40{}
    case S0{} S41{}:
      S41{}
    case S0{} S42{}:
      S42{}
    case S0{} S43{}:
      S43{}
    case S0{} S44{}:
      S44{}
    case S0{} S45{}:
      S45{}
    case S0{} S46{}:
      S46{}
    case S0{} S47{}:
      S47{}
    case S1{} S0{}:
      S1{}
    case S1{} S1{}:
      S0{}
    case S1{} S2{}:
      S3{}
    case S1{} S3{}:
      S2{}
    case S1{} S4{}:
      S5{}
    case S1{} S5{}:
      S4{}
    case S1{} S6{}:
      S7{}
    case S1{} S7{}:
      S6{}
    case S1{} S8{}:
      S9{}
    case S1{} S9{}:
      S8{}
    case S1{} S10{}:
      S11{}
    case S1{} S11{}:
      S10{}
    case S1{} S12{}:
      S13{}
    case S1{} S13{}:
      S12{}
    case S1{} S14{}:
      S15{}
    case S1{} S15{}:
      S14{}
    case S1{} S16{}:
      S17{}
    case S1{} S17{}:
      S16{}
    case S1{} S18{}:
      S19{}
    case S1{} S19{}:
      S18{}
    case S1{} S20{}:
      S21{}
    case S1{} S21{}:
      S20{}
    case S1{} S22{}:
      S23{}
    case S1{} S23{}:
      S22{}
    case S1{} S24{}:
      S25{}
    case S1{} S25{}:
      S24{}
    case S1{} S26{}:
      S27{}
    case S1{} S27{}:
      S26{}
    case S1{} S28{}:
      S29{}
    case S1{} S29{}:
      S28{}
    case S1{} S30{}:
      S31{}
    case S1{} S31{}:
      S30{}
    case S1{} S32{}:
      S33{}
    case S1{} S33{}:
      S32{}
    case S1{} S34{}:
      S35{}
    case S1{} S35{}:
      S34{}
    case S1{} S36{}:
      S37{}
    case S1{} S37{}:
      S36{}
    case S1{} S38{}:
      S39{}
    case S1{} S39{}:
      S38{}
    case S1{} S40{}:
      S41{}
    case S1{} S41{}:
      S40{}
    case S1{} S42{}:
      S43{}
    case S1{} S43{}:
      S42{}
    case S1{} S44{}:
      S45{}
    case S1{} S45{}:
      S44{}
    case S1{} S46{}:
      S47{}
    case S1{} S47{}:
      S46{}
    case S2{} S0{}:
      S2{}
    case S2{} S1{}:
      S3{}
    case S2{} S2{}:
      S0{}
    case S2{} S3{}:
      S1{}
    case S2{} S4{}:
      S6{}
    case S2{} S5{}:
      S7{}
    case S2{} S6{}:
      S4{}
    case S2{} S7{}:
      S5{}
    case S2{} S8{}:
      S10{}
    case S2{} S9{}:
      S11{}
    case S2{} S10{}:
      S8{}
    case S2{} S11{}:
      S9{}
    case S2{} S12{}:
      S14{}
    case S2{} S13{}:
      S15{}
    case S2{} S14{}:
      S12{}
    case S2{} S15{}:
      S13{}
    case S2{} S16{}:
      S18{}
    case S2{} S17{}:
      S19{}
    case S2{} S18{}:
      S16{}
    case S2{} S19{}:
      S17{}
    case S2{} S20{}:
      S22{}
    case S2{} S21{}:
      S23{}
    case S2{} S22{}:
      S20{}
    case S2{} S23{}:
      S21{}
    case S2{} S24{}:
      S26{}
    case S2{} S25{}:
      S27{}
    case S2{} S26{}:
      S24{}
    case S2{} S27{}:
      S25{}
    case S2{} S28{}:
      S30{}
    case S2{} S29{}:
      S31{}
    case S2{} S30{}:
      S28{}
    case S2{} S31{}:
      S29{}
    case S2{} S32{}:
      S34{}
    case S2{} S33{}:
      S35{}
    case S2{} S34{}:
      S32{}
    case S2{} S35{}:
      S33{}
    case S2{} S36{}:
      S38{}
    case S2{} S37{}:
      S39{}
    case S2{} S38{}:
      S36{}
    case S2{} S39{}:
      S37{}
    case S2{} S40{}:
      S42{}
    case S2{} S41{}:
      S43{}
    case S2{} S42{}:
      S40{}
    case S2{} S43{}:
      S41{}
    case S2{} S44{}:
      S46{}
    case S2{} S45{}:
      S47{}
    case S2{} S46{}:
      S44{}
    case S2{} S47{}:
      S45{}
    case S3{} S0{}:
      S3{}
    case S3{} S1{}:
      S2{}
    case S3{} S2{}:
      S1{}
    case S3{} S3{}:
      S0{}
    case S3{} S4{}:
      S7{}
    case S3{} S5{}:
      S6{}
    case S3{} S6{}:
      S5{}
    case S3{} S7{}:
      S4{}
    case S3{} S8{}:
      S11{}
    case S3{} S9{}:
      S10{}
    case S3{} S10{}:
      S9{}
    case S3{} S11{}:
      S8{}
    case S3{} S12{}:
      S15{}
    case S3{} S13{}:
      S14{}
    case S3{} S14{}:
      S13{}
    case S3{} S15{}:
      S12{}
    case S3{} S16{}:
      S19{}
    case S3{} S17{}:
      S18{}
    case S3{} S18{}:
      S17{}
    case S3{} S19{}:
      S16{}
    case S3{} S20{}:
      S23{}
    case S3{} S21{}:
      S22{}
    case S3{} S22{}:
      S21{}
    case S3{} S23{}:
      S20{}
    case S3{} S24{}:
      S27{}
    case S3{} S25{}:
      S26{}
    case S3{} S26{}:
      S25{}
    case S3{} S27{}:
      S24{}
    case S3{} S28{}:
      S31{}
    case S3{} S29{}:
      S30{}
    case S3{} S30{}:
      S29{}
    case S3{} S31{}:
      S28{}
    case S3{} S32{}:
      S35{}
    case S3{} S33{}:
      S34{}
    case S3{} S34{}:
      S33{}
    case S3{} S35{}:
      S32{}
    case S3{} S36{}:
      S39{}
    case S3{} S37{}:
      S38{}
    case S3{} S38{}:
      S37{}
    case S3{} S39{}:
      S36{}
    case S3{} S40{}:
      S43{}
    case S3{} S41{}:
      S42{}
    case S3{} S42{}:
      S41{}
    case S3{} S43{}:
      S40{}
    case S3{} S44{}:
      S47{}
    case S3{} S45{}:
      S46{}
    case S3{} S46{}:
      S45{}
    case S3{} S47{}:
      S44{}
    case S4{} S0{}:
      S4{}
    case S4{} S1{}:
      S5{}
    case S4{} S2{}:
      S6{}
    case S4{} S3{}:
      S7{}
    case S4{} S4{}:
      S0{}
    case S4{} S5{}:
      S1{}
    case S4{} S6{}:
      S2{}
    case S4{} S7{}:
      S3{}
    case S4{} S8{}:
      S12{}
    case S4{} S9{}:
      S13{}
    case S4{} S10{}:
      S14{}
    case S4{} S11{}:
      S15{}
    case S4{} S12{}:
      S8{}
    case S4{} S13{}:
      S9{}
    case S4{} S14{}:
      S10{}
    case S4{} S15{}:
      S11{}
    case S4{} S16{}:
      S20{}
    case S4{} S17{}:
      S21{}
    case S4{} S18{}:
      S22{}
    case S4{} S19{}:
      S23{}
    case S4{} S20{}:
      S16{}
    case S4{} S21{}:
      S17{}
    case S4{} S22{}:
      S18{}
    case S4{} S23{}:
      S19{}
    case S4{} S24{}:
      S28{}
    case S4{} S25{}:
      S29{}
    case S4{} S26{}:
      S30{}
    case S4{} S27{}:
      S31{}
    case S4{} S28{}:
      S24{}
    case S4{} S29{}:
      S25{}
    case S4{} S30{}:
      S26{}
    case S4{} S31{}:
      S27{}
    case S4{} S32{}:
      S36{}
    case S4{} S33{}:
      S37{}
    case S4{} S34{}:
      S38{}
    case S4{} S35{}:
      S39{}
    case S4{} S36{}:
      S32{}
    case S4{} S37{}:
      S33{}
    case S4{} S38{}:
      S34{}
    case S4{} S39{}:
      S35{}
    case S4{} S40{}:
      S44{}
    case S4{} S41{}:
      S45{}
    case S4{} S42{}:
      S46{}
    case S4{} S43{}:
      S47{}
    case S4{} S44{}:
      S40{}
    case S4{} S45{}:
      S41{}
    case S4{} S46{}:
      S42{}
    case S4{} S47{}:
      S43{}
    case S5{} S0{}:
      S5{}
    case S5{} S1{}:
      S4{}
    case S5{} S2{}:
      S7{}
    case S5{} S3{}:
      S6{}
    case S5{} S4{}:
      S1{}
    case S5{} S5{}:
      S0{}
    case S5{} S6{}:
      S3{}
    case S5{} S7{}:
      S2{}
    case S5{} S8{}:
      S13{}
    case S5{} S9{}:
      S12{}
    case S5{} S10{}:
      S15{}
    case S5{} S11{}:
      S14{}
    case S5{} S12{}:
      S9{}
    case S5{} S13{}:
      S8{}
    case S5{} S14{}:
      S11{}
    case S5{} S15{}:
      S10{}
    case S5{} S16{}:
      S21{}
    case S5{} S17{}:
      S20{}
    case S5{} S18{}:
      S23{}
    case S5{} S19{}:
      S22{}
    case S5{} S20{}:
      S17{}
    case S5{} S21{}:
      S16{}
    case S5{} S22{}:
      S19{}
    case S5{} S23{}:
      S18{}
    case S5{} S24{}:
      S29{}
    case S5{} S25{}:
      S28{}
    case S5{} S26{}:
      S31{}
    case S5{} S27{}:
      S30{}
    case S5{} S28{}:
      S25{}
    case S5{} S29{}:
      S24{}
    case S5{} S30{}:
      S27{}
    case S5{} S31{}:
      S26{}
    case S5{} S32{}:
      S37{}
    case S5{} S33{}:
      S36{}
    case S5{} S34{}:
      S39{}
    case S5{} S35{}:
      S38{}
    case S5{} S36{}:
      S33{}
    case S5{} S37{}:
      S32{}
    case S5{} S38{}:
      S35{}
    case S5{} S39{}:
      S34{}
    case S5{} S40{}:
      S45{}
    case S5{} S41{}:
      S44{}
    case S5{} S42{}:
      S47{}
    case S5{} S43{}:
      S46{}
    case S5{} S44{}:
      S41{}
    case S5{} S45{}:
      S40{}
    case S5{} S46{}:
      S43{}
    case S5{} S47{}:
      S42{}
    case S6{} S0{}:
      S6{}
    case S6{} S1{}:
      S7{}
    case S6{} S2{}:
      S4{}
    case S6{} S3{}:
      S5{}
    case S6{} S4{}:
      S2{}
    case S6{} S5{}:
      S3{}
    case S6{} S6{}:
      S0{}
    case S6{} S7{}:
      S1{}
    case S6{} S8{}:
      S14{}
    case S6{} S9{}:
      S15{}
    case S6{} S10{}:
      S12{}
    case S6{} S11{}:
      S13{}
    case S6{} S12{}:
      S10{}
    case S6{} S13{}:
      S11{}
    case S6{} S14{}:
      S8{}
    case S6{} S15{}:
      S9{}
    case S6{} S16{}:
      S22{}
    case S6{} S17{}:
      S23{}
    case S6{} S18{}:
      S20{}
    case S6{} S19{}:
      S21{}
    case S6{} S20{}:
      S18{}
    case S6{} S21{}:
      S19{}
    case S6{} S22{}:
      S16{}
    case S6{} S23{}:
      S17{}
    case S6{} S24{}:
      S30{}
    case S6{} S25{}:
      S31{}
    case S6{} S26{}:
      S28{}
    case S6{} S27{}:
      S29{}
    case S6{} S28{}:
      S26{}
    case S6{} S29{}:
      S27{}
    case S6{} S30{}:
      S24{}
    case S6{} S31{}:
      S25{}
    case S6{} S32{}:
      S38{}
    case S6{} S33{}:
      S39{}
    case S6{} S34{}:
      S36{}
    case S6{} S35{}:
      S37{}
    case S6{} S36{}:
      S34{}
    case S6{} S37{}:
      S35{}
    case S6{} S38{}:
      S32{}
    case S6{} S39{}:
      S33{}
    case S6{} S40{}:
      S46{}
    case S6{} S41{}:
      S47{}
    case S6{} S42{}:
      S44{}
    case S6{} S43{}:
      S45{}
    case S6{} S44{}:
      S42{}
    case S6{} S45{}:
      S43{}
    case S6{} S46{}:
      S40{}
    case S6{} S47{}:
      S41{}
    case S7{} S0{}:
      S7{}
    case S7{} S1{}:
      S6{}
    case S7{} S2{}:
      S5{}
    case S7{} S3{}:
      S4{}
    case S7{} S4{}:
      S3{}
    case S7{} S5{}:
      S2{}
    case S7{} S6{}:
      S1{}
    case S7{} S7{}:
      S0{}
    case S7{} S8{}:
      S15{}
    case S7{} S9{}:
      S14{}
    case S7{} S10{}:
      S13{}
    case S7{} S11{}:
      S12{}
    case S7{} S12{}:
      S11{}
    case S7{} S13{}:
      S10{}
    case S7{} S14{}:
      S9{}
    case S7{} S15{}:
      S8{}
    case S7{} S16{}:
      S23{}
    case S7{} S17{}:
      S22{}
    case S7{} S18{}:
      S21{}
    case S7{} S19{}:
      S20{}
    case S7{} S20{}:
      S19{}
    case S7{} S21{}:
      S18{}
    case S7{} S22{}:
      S17{}
    case S7{} S23{}:
      S16{}
    case S7{} S24{}:
      S31{}
    case S7{} S25{}:
      S30{}
    case S7{} S26{}:
      S29{}
    case S7{} S27{}:
      S28{}
    case S7{} S28{}:
      S27{}
    case S7{} S29{}:
      S26{}
    case S7{} S30{}:
      S25{}
    case S7{} S31{}:
      S24{}
    case S7{} S32{}:
      S39{}
    case S7{} S33{}:
      S38{}
    case S7{} S34{}:
      S37{}
    case S7{} S35{}:
      S36{}
    case S7{} S36{}:
      S35{}
    case S7{} S37{}:
      S34{}
    case S7{} S38{}:
      S33{}
    case S7{} S39{}:
      S32{}
    case S7{} S40{}:
      S47{}
    case S7{} S41{}:
      S46{}
    case S7{} S42{}:
      S45{}
    case S7{} S43{}:
      S44{}
    case S7{} S44{}:
      S43{}
    case S7{} S45{}:
      S42{}
    case S7{} S46{}:
      S41{}
    case S7{} S47{}:
      S40{}
    case S8{} S0{}:
      S8{}
    case S8{} S1{}:
      S9{}
    case S8{} S2{}:
      S12{}
    case S8{} S3{}:
      S13{}
    case S8{} S4{}:
      S10{}
    case S8{} S5{}:
      S11{}
    case S8{} S6{}:
      S14{}
    case S8{} S7{}:
      S15{}
    case S8{} S8{}:
      S0{}
    case S8{} S9{}:
      S1{}
    case S8{} S10{}:
      S4{}
    case S8{} S11{}:
      S5{}
    case S8{} S12{}:
      S2{}
    case S8{} S13{}:
      S3{}
    case S8{} S14{}:
      S6{}
    case S8{} S15{}:
      S7{}
    case S8{} S16{}:
      S24{}
    case S8{} S17{}:
      S25{}
    case S8{} S18{}:
      S28{}
    case S8{} S19{}:
      S29{}
    case S8{} S20{}:
      S26{}
    case S8{} S21{}:
      S27{}
    case S8{} S22{}:
      S30{}
    case S8{} S23{}:
      S31{}
    case S8{} S24{}:
      S16{}
    case S8{} S25{}:
      S17{}
    case S8{} S26{}:
      S20{}
    case S8{} S27{}:
      S21{}
    case S8{} S28{}:
      S18{}
    case S8{} S29{}:
      S19{}
    case S8{} S30{}:
      S22{}
    case S8{} S31{}:
      S23{}
    case S8{} S32{}:
      S40{}
    case S8{} S33{}:
      S41{}
    case S8{} S34{}:
      S44{}
    case S8{} S35{}:
      S45{}
    case S8{} S36{}:
      S42{}
    case S8{} S37{}:
      S43{}
    case S8{} S38{}:
      S46{}
    case S8{} S39{}:
      S47{}
    case S8{} S40{}:
      S32{}
    case S8{} S41{}:
      S33{}
    case S8{} S42{}:
      S36{}
    case S8{} S43{}:
      S37{}
    case S8{} S44{}:
      S34{}
    case S8{} S45{}:
      S35{}
    case S8{} S46{}:
      S38{}
    case S8{} S47{}:
      S39{}
    case S9{} S0{}:
      S9{}
    case S9{} S1{}:
      S8{}
    case S9{} S2{}:
      S13{}
    case S9{} S3{}:
      S12{}
    case S9{} S4{}:
      S11{}
    case S9{} S5{}:
      S10{}
    case S9{} S6{}:
      S15{}
    case S9{} S7{}:
      S14{}
    case S9{} S8{}:
      S1{}
    case S9{} S9{}:
      S0{}
    case S9{} S10{}:
      S5{}
    case S9{} S11{}:
      S4{}
    case S9{} S12{}:
      S3{}
    case S9{} S13{}:
      S2{}
    case S9{} S14{}:
      S7{}
    case S9{} S15{}:
      S6{}
    case S9{} S16{}:
      S25{}
    case S9{} S17{}:
      S24{}
    case S9{} S18{}:
      S29{}
    case S9{} S19{}:
      S28{}
    case S9{} S20{}:
      S27{}
    case S9{} S21{}:
      S26{}
    case S9{} S22{}:
      S31{}
    case S9{} S23{}:
      S30{}
    case S9{} S24{}:
      S17{}
    case S9{} S25{}:
      S16{}
    case S9{} S26{}:
      S21{}
    case S9{} S27{}:
      S20{}
    case S9{} S28{}:
      S19{}
    case S9{} S29{}:
      S18{}
    case S9{} S30{}:
      S23{}
    case S9{} S31{}:
      S22{}
    case S9{} S32{}:
      S41{}
    case S9{} S33{}:
      S40{}
    case S9{} S34{}:
      S45{}
    case S9{} S35{}:
      S44{}
    case S9{} S36{}:
      S43{}
    case S9{} S37{}:
      S42{}
    case S9{} S38{}:
      S47{}
    case S9{} S39{}:
      S46{}
    case S9{} S40{}:
      S33{}
    case S9{} S41{}:
      S32{}
    case S9{} S42{}:
      S37{}
    case S9{} S43{}:
      S36{}
    case S9{} S44{}:
      S35{}
    case S9{} S45{}:
      S34{}
    case S9{} S46{}:
      S39{}
    case S9{} S47{}:
      S38{}
    case S10{} S0{}:
      S10{}
    case S10{} S1{}:
      S11{}
    case S10{} S2{}:
      S14{}
    case S10{} S3{}:
      S15{}
    case S10{} S4{}:
      S8{}
    case S10{} S5{}:
      S9{}
    case S10{} S6{}:
      S12{}
    case S10{} S7{}:
      S13{}
    case S10{} S8{}:
      S2{}
    case S10{} S9{}:
      S3{}
    case S10{} S10{}:
      S6{}
    case S10{} S11{}:
      S7{}
    case S10{} S12{}:
      S0{}
    case S10{} S13{}:
      S1{}
    case S10{} S14{}:
      S4{}
    case S10{} S15{}:
      S5{}
    case S10{} S16{}:
      S26{}
    case S10{} S17{}:
      S27{}
    case S10{} S18{}:
      S30{}
    case S10{} S19{}:
      S31{}
    case S10{} S20{}:
      S24{}
    case S10{} S21{}:
      S25{}
    case S10{} S22{}:
      S28{}
    case S10{} S23{}:
      S29{}
    case S10{} S24{}:
      S18{}
    case S10{} S25{}:
      S19{}
    case S10{} S26{}:
      S22{}
    case S10{} S27{}:
      S23{}
    case S10{} S28{}:
      S16{}
    case S10{} S29{}:
      S17{}
    case S10{} S30{}:
      S20{}
    case S10{} S31{}:
      S21{}
    case S10{} S32{}:
      S42{}
    case S10{} S33{}:
      S43{}
    case S10{} S34{}:
      S46{}
    case S10{} S35{}:
      S47{}
    case S10{} S36{}:
      S40{}
    case S10{} S37{}:
      S41{}
    case S10{} S38{}:
      S44{}
    case S10{} S39{}:
      S45{}
    case S10{} S40{}:
      S34{}
    case S10{} S41{}:
      S35{}
    case S10{} S42{}:
      S38{}
    case S10{} S43{}:
      S39{}
    case S10{} S44{}:
      S32{}
    case S10{} S45{}:
      S33{}
    case S10{} S46{}:
      S36{}
    case S10{} S47{}:
      S37{}
    case S11{} S0{}:
      S11{}
    case S11{} S1{}:
      S10{}
    case S11{} S2{}:
      S15{}
    case S11{} S3{}:
      S14{}
    case S11{} S4{}:
      S9{}
    case S11{} S5{}:
      S8{}
    case S11{} S6{}:
      S13{}
    case S11{} S7{}:
      S12{}
    case S11{} S8{}:
      S3{}
    case S11{} S9{}:
      S2{}
    case S11{} S10{}:
      S7{}
    case S11{} S11{}:
      S6{}
    case S11{} S12{}:
      S1{}
    case S11{} S13{}:
      S0{}
    case S11{} S14{}:
      S5{}
    case S11{} S15{}:
      S4{}
    case S11{} S16{}:
      S27{}
    case S11{} S17{}:
      S26{}
    case S11{} S18{}:
      S31{}
    case S11{} S19{}:
      S30{}
    case S11{} S20{}:
      S25{}
    case S11{} S21{}:
      S24{}
    case S11{} S22{}:
      S29{}
    case S11{} S23{}:
      S28{}
    case S11{} S24{}:
      S19{}
    case S11{} S25{}:
      S18{}
    case S11{} S26{}:
      S23{}
    case S11{} S27{}:
      S22{}
    case S11{} S28{}:
      S17{}
    case S11{} S29{}:
      S16{}
    case S11{} S30{}:
      S21{}
    case S11{} S31{}:
      S20{}
    case S11{} S32{}:
      S43{}
    case S11{} S33{}:
      S42{}
    case S11{} S34{}:
      S47{}
    case S11{} S35{}:
      S46{}
    case S11{} S36{}:
      S41{}
    case S11{} S37{}:
      S40{}
    case S11{} S38{}:
      S45{}
    case S11{} S39{}:
      S44{}
    case S11{} S40{}:
      S35{}
    case S11{} S41{}:
      S34{}
    case S11{} S42{}:
      S39{}
    case S11{} S43{}:
      S38{}
    case S11{} S44{}:
      S33{}
    case S11{} S45{}:
      S32{}
    case S11{} S46{}:
      S37{}
    case S11{} S47{}:
      S36{}
    case S12{} S0{}:
      S12{}
    case S12{} S1{}:
      S13{}
    case S12{} S2{}:
      S8{}
    case S12{} S3{}:
      S9{}
    case S12{} S4{}:
      S14{}
    case S12{} S5{}:
      S15{}
    case S12{} S6{}:
      S10{}
    case S12{} S7{}:
      S11{}
    case S12{} S8{}:
      S4{}
    case S12{} S9{}:
      S5{}
    case S12{} S10{}:
      S0{}
    case S12{} S11{}:
      S1{}
    case S12{} S12{}:
      S6{}
    case S12{} S13{}:
      S7{}
    case S12{} S14{}:
      S2{}
    case S12{} S15{}:
      S3{}
    case S12{} S16{}:
      S28{}
    case S12{} S17{}:
      S29{}
    case S12{} S18{}:
      S24{}
    case S12{} S19{}:
      S25{}
    case S12{} S20{}:
      S30{}
    case S12{} S21{}:
      S31{}
    case S12{} S22{}:
      S26{}
    case S12{} S23{}:
      S27{}
    case S12{} S24{}:
      S20{}
    case S12{} S25{}:
      S21{}
    case S12{} S26{}:
      S16{}
    case S12{} S27{}:
      S17{}
    case S12{} S28{}:
      S22{}
    case S12{} S29{}:
      S23{}
    case S12{} S30{}:
      S18{}
    case S12{} S31{}:
      S19{}
    case S12{} S32{}:
      S44{}
    case S12{} S33{}:
      S45{}
    case S12{} S34{}:
      S40{}
    case S12{} S35{}:
      S41{}
    case S12{} S36{}:
      S46{}
    case S12{} S37{}:
      S47{}
    case S12{} S38{}:
      S42{}
    case S12{} S39{}:
      S43{}
    case S12{} S40{}:
      S36{}
    case S12{} S41{}:
      S37{}
    case S12{} S42{}:
      S32{}
    case S12{} S43{}:
      S33{}
    case S12{} S44{}:
      S38{}
    case S12{} S45{}:
      S39{}
    case S12{} S46{}:
      S34{}
    case S12{} S47{}:
      S35{}
    case S13{} S0{}:
      S13{}
    case S13{} S1{}:
      S12{}
    case S13{} S2{}:
      S9{}
    case S13{} S3{}:
      S8{}
    case S13{} S4{}:
      S15{}
    case S13{} S5{}:
      S14{}
    case S13{} S6{}:
      S11{}
    case S13{} S7{}:
      S10{}
    case S13{} S8{}:
      S5{}
    case S13{} S9{}:
      S4{}
    case S13{} S10{}:
      S1{}
    case S13{} S11{}:
      S0{}
    case S13{} S12{}:
      S7{}
    case S13{} S13{}:
      S6{}
    case S13{} S14{}:
      S3{}
    case S13{} S15{}:
      S2{}
    case S13{} S16{}:
      S29{}
    case S13{} S17{}:
      S28{}
    case S13{} S18{}:
      S25{}
    case S13{} S19{}:
      S24{}
    case S13{} S20{}:
      S31{}
    case S13{} S21{}:
      S30{}
    case S13{} S22{}:
      S27{}
    case S13{} S23{}:
      S26{}
    case S13{} S24{}:
      S21{}
    case S13{} S25{}:
      S20{}
    case S13{} S26{}:
      S17{}
    case S13{} S27{}:
      S16{}
    case S13{} S28{}:
      S23{}
    case S13{} S29{}:
      S22{}
    case S13{} S30{}:
      S19{}
    case S13{} S31{}:
      S18{}
    case S13{} S32{}:
      S45{}
    case S13{} S33{}:
      S44{}
    case S13{} S34{}:
      S41{}
    case S13{} S35{}:
      S40{}
    case S13{} S36{}:
      S47{}
    case S13{} S37{}:
      S46{}
    case S13{} S38{}:
      S43{}
    case S13{} S39{}:
      S42{}
    case S13{} S40{}:
      S37{}
    case S13{} S41{}:
      S36{}
    case S13{} S42{}:
      S33{}
    case S13{} S43{}:
      S32{}
    case S13{} S44{}:
      S39{}
    case S13{} S45{}:
      S38{}
    case S13{} S46{}:
      S35{}
    case S13{} S47{}:
      S34{}
    case S14{} S0{}:
      S14{}
    case S14{} S1{}:
      S15{}
    case S14{} S2{}:
      S10{}
    case S14{} S3{}:
      S11{}
    case S14{} S4{}:
      S12{}
    case S14{} S5{}:
      S13{}
    case S14{} S6{}:
      S8{}
    case S14{} S7{}:
      S9{}
    case S14{} S8{}:
      S6{}
    case S14{} S9{}:
      S7{}
    case S14{} S10{}:
      S2{}
    case S14{} S11{}:
      S3{}
    case S14{} S12{}:
      S4{}
    case S14{} S13{}:
      S5{}
    case S14{} S14{}:
      S0{}
    case S14{} S15{}:
      S1{}
    case S14{} S16{}:
      S30{}
    case S14{} S17{}:
      S31{}
    case S14{} S18{}:
      S26{}
    case S14{} S19{}:
      S27{}
    case S14{} S20{}:
      S28{}
    case S14{} S21{}:
      S29{}
    case S14{} S22{}:
      S24{}
    case S14{} S23{}:
      S25{}
    case S14{} S24{}:
      S22{}
    case S14{} S25{}:
      S23{}
    case S14{} S26{}:
      S18{}
    case S14{} S27{}:
      S19{}
    case S14{} S28{}:
      S20{}
    case S14{} S29{}:
      S21{}
    case S14{} S30{}:
      S16{}
    case S14{} S31{}:
      S17{}
    case S14{} S32{}:
      S46{}
    case S14{} S33{}:
      S47{}
    case S14{} S34{}:
      S42{}
    case S14{} S35{}:
      S43{}
    case S14{} S36{}:
      S44{}
    case S14{} S37{}:
      S45{}
    case S14{} S38{}:
      S40{}
    case S14{} S39{}:
      S41{}
    case S14{} S40{}:
      S38{}
    case S14{} S41{}:
      S39{}
    case S14{} S42{}:
      S34{}
    case S14{} S43{}:
      S35{}
    case S14{} S44{}:
      S36{}
    case S14{} S45{}:
      S37{}
    case S14{} S46{}:
      S32{}
    case S14{} S47{}:
      S33{}
    case S15{} S0{}:
      S15{}
    case S15{} S1{}:
      S14{}
    case S15{} S2{}:
      S11{}
    case S15{} S3{}:
      S10{}
    case S15{} S4{}:
      S13{}
    case S15{} S5{}:
      S12{}
    case S15{} S6{}:
      S9{}
    case S15{} S7{}:
      S8{}
    case S15{} S8{}:
      S7{}
    case S15{} S9{}:
      S6{}
    case S15{} S10{}:
      S3{}
    case S15{} S11{}:
      S2{}
    case S15{} S12{}:
      S5{}
    case S15{} S13{}:
      S4{}
    case S15{} S14{}:
      S1{}
    case S15{} S15{}:
      S0{}
    case S15{} S16{}:
      S31{}
    case S15{} S17{}:
      S30{}
    case S15{} S18{}:
      S27{}
    case S15{} S19{}:
      S26{}
    case S15{} S20{}:
      S29{}
    case S15{} S21{}:
      S28{}
    case S15{} S22{}:
      S25{}
    case S15{} S23{}:
      S24{}
    case S15{} S24{}:
      S23{}
    case S15{} S25{}:
      S22{}
    case S15{} S26{}:
      S19{}
    case S15{} S27{}:
      S18{}
    case S15{} S28{}:
      S21{}
    case S15{} S29{}:
      S20{}
    case S15{} S30{}:
      S17{}
    case S15{} S31{}:
      S16{}
    case S15{} S32{}:
      S47{}
    case S15{} S33{}:
      S46{}
    case S15{} S34{}:
      S43{}
    case S15{} S35{}:
      S42{}
    case S15{} S36{}:
      S45{}
    case S15{} S37{}:
      S44{}
    case S15{} S38{}:
      S41{}
    case S15{} S39{}:
      S40{}
    case S15{} S40{}:
      S39{}
    case S15{} S41{}:
      S38{}
    case S15{} S42{}:
      S35{}
    case S15{} S43{}:
      S34{}
    case S15{} S44{}:
      S37{}
    case S15{} S45{}:
      S36{}
    case S15{} S46{}:
      S33{}
    case S15{} S47{}:
      S32{}
    case S16{} S0{}:
      S16{}
    case S16{} S1{}:
      S18{}
    case S16{} S2{}:
      S17{}
    case S16{} S3{}:
      S19{}
    case S16{} S4{}:
      S20{}
    case S16{} S5{}:
      S22{}
    case S16{} S6{}:
      S21{}
    case S16{} S7{}:
      S23{}
    case S16{} S8{}:
      S32{}
    case S16{} S9{}:
      S34{}
    case S16{} S10{}:
      S33{}
    case S16{} S11{}:
      S35{}
    case S16{} S12{}:
      S36{}
    case S16{} S13{}:
      S38{}
    case S16{} S14{}:
      S37{}
    case S16{} S15{}:
      S39{}
    case S16{} S16{}:
      S0{}
    case S16{} S17{}:
      S2{}
    case S16{} S18{}:
      S1{}
    case S16{} S19{}:
      S3{}
    case S16{} S20{}:
      S4{}
    case S16{} S21{}:
      S6{}
    case S16{} S22{}:
      S5{}
    case S16{} S23{}:
      S7{}
    case S16{} S24{}:
      S40{}
    case S16{} S25{}:
      S42{}
    case S16{} S26{}:
      S41{}
    case S16{} S27{}:
      S43{}
    case S16{} S28{}:
      S44{}
    case S16{} S29{}:
      S46{}
    case S16{} S30{}:
      S45{}
    case S16{} S31{}:
      S47{}
    case S16{} S32{}:
      S8{}
    case S16{} S33{}:
      S10{}
    case S16{} S34{}:
      S9{}
    case S16{} S35{}:
      S11{}
    case S16{} S36{}:
      S12{}
    case S16{} S37{}:
      S14{}
    case S16{} S38{}:
      S13{}
    case S16{} S39{}:
      S15{}
    case S16{} S40{}:
      S24{}
    case S16{} S41{}:
      S26{}
    case S16{} S42{}:
      S25{}
    case S16{} S43{}:
      S27{}
    case S16{} S44{}:
      S28{}
    case S16{} S45{}:
      S30{}
    case S16{} S46{}:
      S29{}
    case S16{} S47{}:
      S31{}
    case S17{} S0{}:
      S17{}
    case S17{} S1{}:
      S19{}
    case S17{} S2{}:
      S16{}
    case S17{} S3{}:
      S18{}
    case S17{} S4{}:
      S21{}
    case S17{} S5{}:
      S23{}
    case S17{} S6{}:
      S20{}
    case S17{} S7{}:
      S22{}
    case S17{} S8{}:
      S33{}
    case S17{} S9{}:
      S35{}
    case S17{} S10{}:
      S32{}
    case S17{} S11{}:
      S34{}
    case S17{} S12{}:
      S37{}
    case S17{} S13{}:
      S39{}
    case S17{} S14{}:
      S36{}
    case S17{} S15{}:
      S38{}
    case S17{} S16{}:
      S1{}
    case S17{} S17{}:
      S3{}
    case S17{} S18{}:
      S0{}
    case S17{} S19{}:
      S2{}
    case S17{} S20{}:
      S5{}
    case S17{} S21{}:
      S7{}
    case S17{} S22{}:
      S4{}
    case S17{} S23{}:
      S6{}
    case S17{} S24{}:
      S41{}
    case S17{} S25{}:
      S43{}
    case S17{} S26{}:
      S40{}
    case S17{} S27{}:
      S42{}
    case S17{} S28{}:
      S45{}
    case S17{} S29{}:
      S47{}
    case S17{} S30{}:
      S44{}
    case S17{} S31{}:
      S46{}
    case S17{} S32{}:
      S9{}
    case S17{} S33{}:
      S11{}
    case S17{} S34{}:
      S8{}
    case S17{} S35{}:
      S10{}
    case S17{} S36{}:
      S13{}
    case S17{} S37{}:
      S15{}
    case S17{} S38{}:
      S12{}
    case S17{} S39{}:
      S14{}
    case S17{} S40{}:
      S25{}
    case S17{} S41{}:
      S27{}
    case S17{} S42{}:
      S24{}
    case S17{} S43{}:
      S26{}
    case S17{} S44{}:
      S29{}
    case S17{} S45{}:
      S31{}
    case S17{} S46{}:
      S28{}
    case S17{} S47{}:
      S30{}
    case S18{} S0{}:
      S18{}
    case S18{} S1{}:
      S16{}
    case S18{} S2{}:
      S19{}
    case S18{} S3{}:
      S17{}
    case S18{} S4{}:
      S22{}
    case S18{} S5{}:
      S20{}
    case S18{} S6{}:
      S23{}
    case S18{} S7{}:
      S21{}
    case S18{} S8{}:
      S34{}
    case S18{} S9{}:
      S32{}
    case S18{} S10{}:
      S35{}
    case S18{} S11{}:
      S33{}
    case S18{} S12{}:
      S38{}
    case S18{} S13{}:
      S36{}
    case S18{} S14{}:
      S39{}
    case S18{} S15{}:
      S37{}
    case S18{} S16{}:
      S2{}
    case S18{} S17{}:
      S0{}
    case S18{} S18{}:
      S3{}
    case S18{} S19{}:
      S1{}
    case S18{} S20{}:
      S6{}
    case S18{} S21{}:
      S4{}
    case S18{} S22{}:
      S7{}
    case S18{} S23{}:
      S5{}
    case S18{} S24{}:
      S42{}
    case S18{} S25{}:
      S40{}
    case S18{} S26{}:
      S43{}
    case S18{} S27{}:
      S41{}
    case S18{} S28{}:
      S46{}
    case S18{} S29{}:
      S44{}
    case S18{} S30{}:
      S47{}
    case S18{} S31{}:
      S45{}
    case S18{} S32{}:
      S10{}
    case S18{} S33{}:
      S8{}
    case S18{} S34{}:
      S11{}
    case S18{} S35{}:
      S9{}
    case S18{} S36{}:
      S14{}
    case S18{} S37{}:
      S12{}
    case S18{} S38{}:
      S15{}
    case S18{} S39{}:
      S13{}
    case S18{} S40{}:
      S26{}
    case S18{} S41{}:
      S24{}
    case S18{} S42{}:
      S27{}
    case S18{} S43{}:
      S25{}
    case S18{} S44{}:
      S30{}
    case S18{} S45{}:
      S28{}
    case S18{} S46{}:
      S31{}
    case S18{} S47{}:
      S29{}
    case S19{} S0{}:
      S19{}
    case S19{} S1{}:
      S17{}
    case S19{} S2{}:
      S18{}
    case S19{} S3{}:
      S16{}
    case S19{} S4{}:
      S23{}
    case S19{} S5{}:
      S21{}
    case S19{} S6{}:
      S22{}
    case S19{} S7{}:
      S20{}
    case S19{} S8{}:
      S35{}
    case S19{} S9{}:
      S33{}
    case S19{} S10{}:
      S34{}
    case S19{} S11{}:
      S32{}
    case S19{} S12{}:
      S39{}
    case S19{} S13{}:
      S37{}
    case S19{} S14{}:
      S38{}
    case S19{} S15{}:
      S36{}
    case S19{} S16{}:
      S3{}
    case S19{} S17{}:
      S1{}
    case S19{} S18{}:
      S2{}
    case S19{} S19{}:
      S0{}
    case S19{} S20{}:
      S7{}
    case S19{} S21{}:
      S5{}
    case S19{} S22{}:
      S6{}
    case S19{} S23{}:
      S4{}
    case S19{} S24{}:
      S43{}
    case S19{} S25{}:
      S41{}
    case S19{} S26{}:
      S42{}
    case S19{} S27{}:
      S40{}
    case S19{} S28{}:
      S47{}
    case S19{} S29{}:
      S45{}
    case S19{} S30{}:
      S46{}
    case S19{} S31{}:
      S44{}
    case S19{} S32{}:
      S11{}
    case S19{} S33{}:
      S9{}
    case S19{} S34{}:
      S10{}
    case S19{} S35{}:
      S8{}
    case S19{} S36{}:
      S15{}
    case S19{} S37{}:
      S13{}
    case S19{} S38{}:
      S14{}
    case S19{} S39{}:
      S12{}
    case S19{} S40{}:
      S27{}
    case S19{} S41{}:
      S25{}
    case S19{} S42{}:
      S26{}
    case S19{} S43{}:
      S24{}
    case S19{} S44{}:
      S31{}
    case S19{} S45{}:
      S29{}
    case S19{} S46{}:
      S30{}
    case S19{} S47{}:
      S28{}
    case S20{} S0{}:
      S20{}
    case S20{} S1{}:
      S22{}
    case S20{} S2{}:
      S21{}
    case S20{} S3{}:
      S23{}
    case S20{} S4{}:
      S16{}
    case S20{} S5{}:
      S18{}
    case S20{} S6{}:
      S17{}
    case S20{} S7{}:
      S19{}
    case S20{} S8{}:
      S36{}
    case S20{} S9{}:
      S38{}
    case S20{} S10{}:
      S37{}
    case S20{} S11{}:
      S39{}
    case S20{} S12{}:
      S32{}
    case S20{} S13{}:
      S34{}
    case S20{} S14{}:
      S33{}
    case S20{} S15{}:
      S35{}
    case S20{} S16{}:
      S4{}
    case S20{} S17{}:
      S6{}
    case S20{} S18{}:
      S5{}
    case S20{} S19{}:
      S7{}
    case S20{} S20{}:
      S0{}
    case S20{} S21{}:
      S2{}
    case S20{} S22{}:
      S1{}
    case S20{} S23{}:
      S3{}
    case S20{} S24{}:
      S44{}
    case S20{} S25{}:
      S46{}
    case S20{} S26{}:
      S45{}
    case S20{} S27{}:
      S47{}
    case S20{} S28{}:
      S40{}
    case S20{} S29{}:
      S42{}
    case S20{} S30{}:
      S41{}
    case S20{} S31{}:
      S43{}
    case S20{} S32{}:
      S12{}
    case S20{} S33{}:
      S14{}
    case S20{} S34{}:
      S13{}
    case S20{} S35{}:
      S15{}
    case S20{} S36{}:
      S8{}
    case S20{} S37{}:
      S10{}
    case S20{} S38{}:
      S9{}
    case S20{} S39{}:
      S11{}
    case S20{} S40{}:
      S28{}
    case S20{} S41{}:
      S30{}
    case S20{} S42{}:
      S29{}
    case S20{} S43{}:
      S31{}
    case S20{} S44{}:
      S24{}
    case S20{} S45{}:
      S26{}
    case S20{} S46{}:
      S25{}
    case S20{} S47{}:
      S27{}
    case S21{} S0{}:
      S21{}
    case S21{} S1{}:
      S23{}
    case S21{} S2{}:
      S20{}
    case S21{} S3{}:
      S22{}
    case S21{} S4{}:
      S17{}
    case S21{} S5{}:
      S19{}
    case S21{} S6{}:
      S16{}
    case S21{} S7{}:
      S18{}
    case S21{} S8{}:
      S37{}
    case S21{} S9{}:
      S39{}
    case S21{} S10{}:
      S36{}
    case S21{} S11{}:
      S38{}
    case S21{} S12{}:
      S33{}
    case S21{} S13{}:
      S35{}
    case S21{} S14{}:
      S32{}
    case S21{} S15{}:
      S34{}
    case S21{} S16{}:
      S5{}
    case S21{} S17{}:
      S7{}
    case S21{} S18{}:
      S4{}
    case S21{} S19{}:
      S6{}
    case S21{} S20{}:
      S1{}
    case S21{} S21{}:
      S3{}
    case S21{} S22{}:
      S0{}
    case S21{} S23{}:
      S2{}
    case S21{} S24{}:
      S45{}
    case S21{} S25{}:
      S47{}
    case S21{} S26{}:
      S44{}
    case S21{} S27{}:
      S46{}
    case S21{} S28{}:
      S41{}
    case S21{} S29{}:
      S43{}
    case S21{} S30{}:
      S40{}
    case S21{} S31{}:
      S42{}
    case S21{} S32{}:
      S13{}
    case S21{} S33{}:
      S15{}
    case S21{} S34{}:
      S12{}
    case S21{} S35{}:
      S14{}
    case S21{} S36{}:
      S9{}
    case S21{} S37{}:
      S11{}
    case S21{} S38{}:
      S8{}
    case S21{} S39{}:
      S10{}
    case S21{} S40{}:
      S29{}
    case S21{} S41{}:
      S31{}
    case S21{} S42{}:
      S28{}
    case S21{} S43{}:
      S30{}
    case S21{} S44{}:
      S25{}
    case S21{} S45{}:
      S27{}
    case S21{} S46{}:
      S24{}
    case S21{} S47{}:
      S26{}
    case S22{} S0{}:
      S22{}
    case S22{} S1{}:
      S20{}
    case S22{} S2{}:
      S23{}
    case S22{} S3{}:
      S21{}
    case S22{} S4{}:
      S18{}
    case S22{} S5{}:
      S16{}
    case S22{} S6{}:
      S19{}
    case S22{} S7{}:
      S17{}
    case S22{} S8{}:
      S38{}
    case S22{} S9{}:
      S36{}
    case S22{} S10{}:
      S39{}
    case S22{} S11{}:
      S37{}
    case S22{} S12{}:
      S34{}
    case S22{} S13{}:
      S32{}
    case S22{} S14{}:
      S35{}
    case S22{} S15{}:
      S33{}
    case S22{} S16{}:
      S6{}
    case S22{} S17{}:
      S4{}
    case S22{} S18{}:
      S7{}
    case S22{} S19{}:
      S5{}
    case S22{} S20{}:
      S2{}
    case S22{} S21{}:
      S0{}
    case S22{} S22{}:
      S3{}
    case S22{} S23{}:
      S1{}
    case S22{} S24{}:
      S46{}
    case S22{} S25{}:
      S44{}
    case S22{} S26{}:
      S47{}
    case S22{} S27{}:
      S45{}
    case S22{} S28{}:
      S42{}
    case S22{} S29{}:
      S40{}
    case S22{} S30{}:
      S43{}
    case S22{} S31{}:
      S41{}
    case S22{} S32{}:
      S14{}
    case S22{} S33{}:
      S12{}
    case S22{} S34{}:
      S15{}
    case S22{} S35{}:
      S13{}
    case S22{} S36{}:
      S10{}
    case S22{} S37{}:
      S8{}
    case S22{} S38{}:
      S11{}
    case S22{} S39{}:
      S9{}
    case S22{} S40{}:
      S30{}
    case S22{} S41{}:
      S28{}
    case S22{} S42{}:
      S31{}
    case S22{} S43{}:
      S29{}
    case S22{} S44{}:
      S26{}
    case S22{} S45{}:
      S24{}
    case S22{} S46{}:
      S27{}
    case S22{} S47{}:
      S25{}
    case S23{} S0{}:
      S23{}
    case S23{} S1{}:
      S21{}
    case S23{} S2{}:
      S22{}
    case S23{} S3{}:
      S20{}
    case S23{} S4{}:
      S19{}
    case S23{} S5{}:
      S17{}
    case S23{} S6{}:
      S18{}
    case S23{} S7{}:
      S16{}
    case S23{} S8{}:
      S39{}
    case S23{} S9{}:
      S37{}
    case S23{} S10{}:
      S38{}
    case S23{} S11{}:
      S36{}
    case S23{} S12{}:
      S35{}
    case S23{} S13{}:
      S33{}
    case S23{} S14{}:
      S34{}
    case S23{} S15{}:
      S32{}
    case S23{} S16{}:
      S7{}
    case S23{} S17{}:
      S5{}
    case S23{} S18{}:
      S6{}
    case S23{} S19{}:
      S4{}
    case S23{} S20{}:
      S3{}
    case S23{} S21{}:
      S1{}
    case S23{} S22{}:
      S2{}
    case S23{} S23{}:
      S0{}
    case S23{} S24{}:
      S47{}
    case S23{} S25{}:
      S45{}
    case S23{} S26{}:
      S46{}
    case S23{} S27{}:
      S44{}
    case S23{} S28{}:
      S43{}
    case S23{} S29{}:
      S41{}
    case S23{} S30{}:
      S42{}
    case S23{} S31{}:
      S40{}
    case S23{} S32{}:
      S15{}
    case S23{} S33{}:
      S13{}
    case S23{} S34{}:
      S14{}
    case S23{} S35{}:
      S12{}
    case S23{} S36{}:
      S11{}
    case S23{} S37{}:
      S9{}
    case S23{} S38{}:
      S10{}
    case S23{} S39{}:
      S8{}
    case S23{} S40{}:
      S31{}
    case S23{} S41{}:
      S29{}
    case S23{} S42{}:
      S30{}
    case S23{} S43{}:
      S28{}
    case S23{} S44{}:
      S27{}
    case S23{} S45{}:
      S25{}
    case S23{} S46{}:
      S26{}
    case S23{} S47{}:
      S24{}
    case S24{} S0{}:
      S24{}
    case S24{} S1{}:
      S28{}
    case S24{} S2{}:
      S25{}
    case S24{} S3{}:
      S29{}
    case S24{} S4{}:
      S26{}
    case S24{} S5{}:
      S30{}
    case S24{} S6{}:
      S27{}
    case S24{} S7{}:
      S31{}
    case S24{} S8{}:
      S40{}
    case S24{} S9{}:
      S44{}
    case S24{} S10{}:
      S41{}
    case S24{} S11{}:
      S45{}
    case S24{} S12{}:
      S42{}
    case S24{} S13{}:
      S46{}
    case S24{} S14{}:
      S43{}
    case S24{} S15{}:
      S47{}
    case S24{} S16{}:
      S8{}
    case S24{} S17{}:
      S12{}
    case S24{} S18{}:
      S9{}
    case S24{} S19{}:
      S13{}
    case S24{} S20{}:
      S10{}
    case S24{} S21{}:
      S14{}
    case S24{} S22{}:
      S11{}
    case S24{} S23{}:
      S15{}
    case S24{} S24{}:
      S32{}
    case S24{} S25{}:
      S36{}
    case S24{} S26{}:
      S33{}
    case S24{} S27{}:
      S37{}
    case S24{} S28{}:
      S34{}
    case S24{} S29{}:
      S38{}
    case S24{} S30{}:
      S35{}
    case S24{} S31{}:
      S39{}
    case S24{} S32{}:
      S0{}
    case S24{} S33{}:
      S4{}
    case S24{} S34{}:
      S1{}
    case S24{} S35{}:
      S5{}
    case S24{} S36{}:
      S2{}
    case S24{} S37{}:
      S6{}
    case S24{} S38{}:
      S3{}
    case S24{} S39{}:
      S7{}
    case S24{} S40{}:
      S16{}
    case S24{} S41{}:
      S20{}
    case S24{} S42{}:
      S17{}
    case S24{} S43{}:
      S21{}
    case S24{} S44{}:
      S18{}
    case S24{} S45{}:
      S22{}
    case S24{} S46{}:
      S19{}
    case S24{} S47{}:
      S23{}
    case S25{} S0{}:
      S25{}
    case S25{} S1{}:
      S29{}
    case S25{} S2{}:
      S24{}
    case S25{} S3{}:
      S28{}
    case S25{} S4{}:
      S27{}
    case S25{} S5{}:
      S31{}
    case S25{} S6{}:
      S26{}
    case S25{} S7{}:
      S30{}
    case S25{} S8{}:
      S41{}
    case S25{} S9{}:
      S45{}
    case S25{} S10{}:
      S40{}
    case S25{} S11{}:
      S44{}
    case S25{} S12{}:
      S43{}
    case S25{} S13{}:
      S47{}
    case S25{} S14{}:
      S42{}
    case S25{} S15{}:
      S46{}
    case S25{} S16{}:
      S9{}
    case S25{} S17{}:
      S13{}
    case S25{} S18{}:
      S8{}
    case S25{} S19{}:
      S12{}
    case S25{} S20{}:
      S11{}
    case S25{} S21{}:
      S15{}
    case S25{} S22{}:
      S10{}
    case S25{} S23{}:
      S14{}
    case S25{} S24{}:
      S33{}
    case S25{} S25{}:
      S37{}
    case S25{} S26{}:
      S32{}
    case S25{} S27{}:
      S36{}
    case S25{} S28{}:
      S35{}
    case S25{} S29{}:
      S39{}
    case S25{} S30{}:
      S34{}
    case S25{} S31{}:
      S38{}
    case S25{} S32{}:
      S1{}
    case S25{} S33{}:
      S5{}
    case S25{} S34{}:
      S0{}
    case S25{} S35{}:
      S4{}
    case S25{} S36{}:
      S3{}
    case S25{} S37{}:
      S7{}
    case S25{} S38{}:
      S2{}
    case S25{} S39{}:
      S6{}
    case S25{} S40{}:
      S17{}
    case S25{} S41{}:
      S21{}
    case S25{} S42{}:
      S16{}
    case S25{} S43{}:
      S20{}
    case S25{} S44{}:
      S19{}
    case S25{} S45{}:
      S23{}
    case S25{} S46{}:
      S18{}
    case S25{} S47{}:
      S22{}
    case S26{} S0{}:
      S26{}
    case S26{} S1{}:
      S30{}
    case S26{} S2{}:
      S27{}
    case S26{} S3{}:
      S31{}
    case S26{} S4{}:
      S24{}
    case S26{} S5{}:
      S28{}
    case S26{} S6{}:
      S25{}
    case S26{} S7{}:
      S29{}
    case S26{} S8{}:
      S42{}
    case S26{} S9{}:
      S46{}
    case S26{} S10{}:
      S43{}
    case S26{} S11{}:
      S47{}
    case S26{} S12{}:
      S40{}
    case S26{} S13{}:
      S44{}
    case S26{} S14{}:
      S41{}
    case S26{} S15{}:
      S45{}
    case S26{} S16{}:
      S10{}
    case S26{} S17{}:
      S14{}
    case S26{} S18{}:
      S11{}
    case S26{} S19{}:
      S15{}
    case S26{} S20{}:
      S8{}
    case S26{} S21{}:
      S12{}
    case S26{} S22{}:
      S9{}
    case S26{} S23{}:
      S13{}
    case S26{} S24{}:
      S34{}
    case S26{} S25{}:
      S38{}
    case S26{} S26{}:
      S35{}
    case S26{} S27{}:
      S39{}
    case S26{} S28{}:
      S32{}
    case S26{} S29{}:
      S36{}
    case S26{} S30{}:
      S33{}
    case S26{} S31{}:
      S37{}
    case S26{} S32{}:
      S2{}
    case S26{} S33{}:
      S6{}
    case S26{} S34{}:
      S3{}
    case S26{} S35{}:
      S7{}
    case S26{} S36{}:
      S0{}
    case S26{} S37{}:
      S4{}
    case S26{} S38{}:
      S1{}
    case S26{} S39{}:
      S5{}
    case S26{} S40{}:
      S18{}
    case S26{} S41{}:
      S22{}
    case S26{} S42{}:
      S19{}
    case S26{} S43{}:
      S23{}
    case S26{} S44{}:
      S16{}
    case S26{} S45{}:
      S20{}
    case S26{} S46{}:
      S17{}
    case S26{} S47{}:
      S21{}
    case S27{} S0{}:
      S27{}
    case S27{} S1{}:
      S31{}
    case S27{} S2{}:
      S26{}
    case S27{} S3{}:
      S30{}
    case S27{} S4{}:
      S25{}
    case S27{} S5{}:
      S29{}
    case S27{} S6{}:
      S24{}
    case S27{} S7{}:
      S28{}
    case S27{} S8{}:
      S43{}
    case S27{} S9{}:
      S47{}
    case S27{} S10{}:
      S42{}
    case S27{} S11{}:
      S46{}
    case S27{} S12{}:
      S41{}
    case S27{} S13{}:
      S45{}
    case S27{} S14{}:
      S40{}
    case S27{} S15{}:
      S44{}
    case S27{} S16{}:
      S11{}
    case S27{} S17{}:
      S15{}
    case S27{} S18{}:
      S10{}
    case S27{} S19{}:
      S14{}
    case S27{} S20{}:
      S9{}
    case S27{} S21{}:
      S13{}
    case S27{} S22{}:
      S8{}
    case S27{} S23{}:
      S12{}
    case S27{} S24{}:
      S35{}
    case S27{} S25{}:
      S39{}
    case S27{} S26{}:
      S34{}
    case S27{} S27{}:
      S38{}
    case S27{} S28{}:
      S33{}
    case S27{} S29{}:
      S37{}
    case S27{} S30{}:
      S32{}
    case S27{} S31{}:
      S36{}
    case S27{} S32{}:
      S3{}
    case S27{} S33{}:
      S7{}
    case S27{} S34{}:
      S2{}
    case S27{} S35{}:
      S6{}
    case S27{} S36{}:
      S1{}
    case S27{} S37{}:
      S5{}
    case S27{} S38{}:
      S0{}
    case S27{} S39{}:
      S4{}
    case S27{} S40{}:
      S19{}
    case S27{} S41{}:
      S23{}
    case S27{} S42{}:
      S18{}
    case S27{} S43{}:
      S22{}
    case S27{} S44{}:
      S17{}
    case S27{} S45{}:
      S21{}
    case S27{} S46{}:
      S16{}
    case S27{} S47{}:
      S20{}
    case S28{} S0{}:
      S28{}
    case S28{} S1{}:
      S24{}
    case S28{} S2{}:
      S29{}
    case S28{} S3{}:
      S25{}
    case S28{} S4{}:
      S30{}
    case S28{} S5{}:
      S26{}
    case S28{} S6{}:
      S31{}
    case S28{} S7{}:
      S27{}
    case S28{} S8{}:
      S44{}
    case S28{} S9{}:
      S40{}
    case S28{} S10{}:
      S45{}
    case S28{} S11{}:
      S41{}
    case S28{} S12{}:
      S46{}
    case S28{} S13{}:
      S42{}
    case S28{} S14{}:
      S47{}
    case S28{} S15{}:
      S43{}
    case S28{} S16{}:
      S12{}
    case S28{} S17{}:
      S8{}
    case S28{} S18{}:
      S13{}
    case S28{} S19{}:
      S9{}
    case S28{} S20{}:
      S14{}
    case S28{} S21{}:
      S10{}
    case S28{} S22{}:
      S15{}
    case S28{} S23{}:
      S11{}
    case S28{} S24{}:
      S36{}
    case S28{} S25{}:
      S32{}
    case S28{} S26{}:
      S37{}
    case S28{} S27{}:
      S33{}
    case S28{} S28{}:
      S38{}
    case S28{} S29{}:
      S34{}
    case S28{} S30{}:
      S39{}
    case S28{} S31{}:
      S35{}
    case S28{} S32{}:
      S4{}
    case S28{} S33{}:
      S0{}
    case S28{} S34{}:
      S5{}
    case S28{} S35{}:
      S1{}
    case S28{} S36{}:
      S6{}
    case S28{} S37{}:
      S2{}
    case S28{} S38{}:
      S7{}
    case S28{} S39{}:
      S3{}
    case S28{} S40{}:
      S20{}
    case S28{} S41{}:
      S16{}
    case S28{} S42{}:
      S21{}
    case S28{} S43{}:
      S17{}
    case S28{} S44{}:
      S22{}
    case S28{} S45{}:
      S18{}
    case S28{} S46{}:
      S23{}
    case S28{} S47{}:
      S19{}
    case S29{} S0{}:
      S29{}
    case S29{} S1{}:
      S25{}
    case S29{} S2{}:
      S28{}
    case S29{} S3{}:
      S24{}
    case S29{} S4{}:
      S31{}
    case S29{} S5{}:
      S27{}
    case S29{} S6{}:
      S30{}
    case S29{} S7{}:
      S26{}
    case S29{} S8{}:
      S45{}
    case S29{} S9{}:
      S41{}
    case S29{} S10{}:
      S44{}
    case S29{} S11{}:
      S40{}
    case S29{} S12{}:
      S47{}
    case S29{} S13{}:
      S43{}
    case S29{} S14{}:
      S46{}
    case S29{} S15{}:
      S42{}
    case S29{} S16{}:
      S13{}
    case S29{} S17{}:
      S9{}
    case S29{} S18{}:
      S12{}
    case S29{} S19{}:
      S8{}
    case S29{} S20{}:
      S15{}
    case S29{} S21{}:
      S11{}
    case S29{} S22{}:
      S14{}
    case S29{} S23{}:
      S10{}
    case S29{} S24{}:
      S37{}
    case S29{} S25{}:
      S33{}
    case S29{} S26{}:
      S36{}
    case S29{} S27{}:
      S32{}
    case S29{} S28{}:
      S39{}
    case S29{} S29{}:
      S35{}
    case S29{} S30{}:
      S38{}
    case S29{} S31{}:
      S34{}
    case S29{} S32{}:
      S5{}
    case S29{} S33{}:
      S1{}
    case S29{} S34{}:
      S4{}
    case S29{} S35{}:
      S0{}
    case S29{} S36{}:
      S7{}
    case S29{} S37{}:
      S3{}
    case S29{} S38{}:
      S6{}
    case S29{} S39{}:
      S2{}
    case S29{} S40{}:
      S21{}
    case S29{} S41{}:
      S17{}
    case S29{} S42{}:
      S20{}
    case S29{} S43{}:
      S16{}
    case S29{} S44{}:
      S23{}
    case S29{} S45{}:
      S19{}
    case S29{} S46{}:
      S22{}
    case S29{} S47{}:
      S18{}
    case S30{} S0{}:
      S30{}
    case S30{} S1{}:
      S26{}
    case S30{} S2{}:
      S31{}
    case S30{} S3{}:
      S27{}
    case S30{} S4{}:
      S28{}
    case S30{} S5{}:
      S24{}
    case S30{} S6{}:
      S29{}
    case S30{} S7{}:
      S25{}
    case S30{} S8{}:
      S46{}
    case S30{} S9{}:
      S42{}
    case S30{} S10{}:
      S47{}
    case S30{} S11{}:
      S43{}
    case S30{} S12{}:
      S44{}
    case S30{} S13{}:
      S40{}
    case S30{} S14{}:
      S45{}
    case S30{} S15{}:
      S41{}
    case S30{} S16{}:
      S14{}
    case S30{} S17{}:
      S10{}
    case S30{} S18{}:
      S15{}
    case S30{} S19{}:
      S11{}
    case S30{} S20{}:
      S12{}
    case S30{} S21{}:
      S8{}
    case S30{} S22{}:
      S13{}
    case S30{} S23{}:
      S9{}
    case S30{} S24{}:
      S38{}
    case S30{} S25{}:
      S34{}
    case S30{} S26{}:
      S39{}
    case S30{} S27{}:
      S35{}
    case S30{} S28{}:
      S36{}
    case S30{} S29{}:
      S32{}
    case S30{} S30{}:
      S37{}
    case S30{} S31{}:
      S33{}
    case S30{} S32{}:
      S6{}
    case S30{} S33{}:
      S2{}
    case S30{} S34{}:
      S7{}
    case S30{} S35{}:
      S3{}
    case S30{} S36{}:
      S4{}
    case S30{} S37{}:
      S0{}
    case S30{} S38{}:
      S5{}
    case S30{} S39{}:
      S1{}
    case S30{} S40{}:
      S22{}
    case S30{} S41{}:
      S18{}
    case S30{} S42{}:
      S23{}
    case S30{} S43{}:
      S19{}
    case S30{} S44{}:
      S20{}
    case S30{} S45{}:
      S16{}
    case S30{} S46{}:
      S21{}
    case S30{} S47{}:
      S17{}
    case S31{} S0{}:
      S31{}
    case S31{} S1{}:
      S27{}
    case S31{} S2{}:
      S30{}
    case S31{} S3{}:
      S26{}
    case S31{} S4{}:
      S29{}
    case S31{} S5{}:
      S25{}
    case S31{} S6{}:
      S28{}
    case S31{} S7{}:
      S24{}
    case S31{} S8{}:
      S47{}
    case S31{} S9{}:
      S43{}
    case S31{} S10{}:
      S46{}
    case S31{} S11{}:
      S42{}
    case S31{} S12{}:
      S45{}
    case S31{} S13{}:
      S41{}
    case S31{} S14{}:
      S44{}
    case S31{} S15{}:
      S40{}
    case S31{} S16{}:
      S15{}
    case S31{} S17{}:
      S11{}
    case S31{} S18{}:
      S14{}
    case S31{} S19{}:
      S10{}
    case S31{} S20{}:
      S13{}
    case S31{} S21{}:
      S9{}
    case S31{} S22{}:
      S12{}
    case S31{} S23{}:
      S8{}
    case S31{} S24{}:
      S39{}
    case S31{} S25{}:
      S35{}
    case S31{} S26{}:
      S38{}
    case S31{} S27{}:
      S34{}
    case S31{} S28{}:
      S37{}
    case S31{} S29{}:
      S33{}
    case S31{} S30{}:
      S36{}
    case S31{} S31{}:
      S32{}
    case S31{} S32{}:
      S7{}
    case S31{} S33{}:
      S3{}
    case S31{} S34{}:
      S6{}
    case S31{} S35{}:
      S2{}
    case S31{} S36{}:
      S5{}
    case S31{} S37{}:
      S1{}
    case S31{} S38{}:
      S4{}
    case S31{} S39{}:
      S0{}
    case S31{} S40{}:
      S23{}
    case S31{} S41{}:
      S19{}
    case S31{} S42{}:
      S22{}
    case S31{} S43{}:
      S18{}
    case S31{} S44{}:
      S21{}
    case S31{} S45{}:
      S17{}
    case S31{} S46{}:
      S20{}
    case S31{} S47{}:
      S16{}
    case S32{} S0{}:
      S32{}
    case S32{} S1{}:
      S34{}
    case S32{} S2{}:
      S36{}
    case S32{} S3{}:
      S38{}
    case S32{} S4{}:
      S33{}
    case S32{} S5{}:
      S35{}
    case S32{} S6{}:
      S37{}
    case S32{} S7{}:
      S39{}
    case S32{} S8{}:
      S16{}
    case S32{} S9{}:
      S18{}
    case S32{} S10{}:
      S20{}
    case S32{} S11{}:
      S22{}
    case S32{} S12{}:
      S17{}
    case S32{} S13{}:
      S19{}
    case S32{} S14{}:
      S21{}
    case S32{} S15{}:
      S23{}
    case S32{} S16{}:
      S40{}
    case S32{} S17{}:
      S42{}
    case S32{} S18{}:
      S44{}
    case S32{} S19{}:
      S46{}
    case S32{} S20{}:
      S41{}
    case S32{} S21{}:
      S43{}
    case S32{} S22{}:
      S45{}
    case S32{} S23{}:
      S47{}
    case S32{} S24{}:
      S0{}
    case S32{} S25{}:
      S2{}
    case S32{} S26{}:
      S4{}
    case S32{} S27{}:
      S6{}
    case S32{} S28{}:
      S1{}
    case S32{} S29{}:
      S3{}
    case S32{} S30{}:
      S5{}
    case S32{} S31{}:
      S7{}
    case S32{} S32{}:
      S24{}
    case S32{} S33{}:
      S26{}
    case S32{} S34{}:
      S28{}
    case S32{} S35{}:
      S30{}
    case S32{} S36{}:
      S25{}
    case S32{} S37{}:
      S27{}
    case S32{} S38{}:
      S29{}
    case S32{} S39{}:
      S31{}
    case S32{} S40{}:
      S8{}
    case S32{} S41{}:
      S10{}
    case S32{} S42{}:
      S12{}
    case S32{} S43{}:
      S14{}
    case S32{} S44{}:
      S9{}
    case S32{} S45{}:
      S11{}
    case S32{} S46{}:
      S13{}
    case S32{} S47{}:
      S15{}
    case S33{} S0{}:
      S33{}
    case S33{} S1{}:
      S35{}
    case S33{} S2{}:
      S37{}
    case S33{} S3{}:
      S39{}
    case S33{} S4{}:
      S32{}
    case S33{} S5{}:
      S34{}
    case S33{} S6{}:
      S36{}
    case S33{} S7{}:
      S38{}
    case S33{} S8{}:
      S17{}
    case S33{} S9{}:
      S19{}
    case S33{} S10{}:
      S21{}
    case S33{} S11{}:
      S23{}
    case S33{} S12{}:
      S16{}
    case S33{} S13{}:
      S18{}
    case S33{} S14{}:
      S20{}
    case S33{} S15{}:
      S22{}
    case S33{} S16{}:
      S41{}
    case S33{} S17{}:
      S43{}
    case S33{} S18{}:
      S45{}
    case S33{} S19{}:
      S47{}
    case S33{} S20{}:
      S40{}
    case S33{} S21{}:
      S42{}
    case S33{} S22{}:
      S44{}
    case S33{} S23{}:
      S46{}
    case S33{} S24{}:
      S1{}
    case S33{} S25{}:
      S3{}
    case S33{} S26{}:
      S5{}
    case S33{} S27{}:
      S7{}
    case S33{} S28{}:
      S0{}
    case S33{} S29{}:
      S2{}
    case S33{} S30{}:
      S4{}
    case S33{} S31{}:
      S6{}
    case S33{} S32{}:
      S25{}
    case S33{} S33{}:
      S27{}
    case S33{} S34{}:
      S29{}
    case S33{} S35{}:
      S31{}
    case S33{} S36{}:
      S24{}
    case S33{} S37{}:
      S26{}
    case S33{} S38{}:
      S28{}
    case S33{} S39{}:
      S30{}
    case S33{} S40{}:
      S9{}
    case S33{} S41{}:
      S11{}
    case S33{} S42{}:
      S13{}
    case S33{} S43{}:
      S15{}
    case S33{} S44{}:
      S8{}
    case S33{} S45{}:
      S10{}
    case S33{} S46{}:
      S12{}
    case S33{} S47{}:
      S14{}
    case S34{} S0{}:
      S34{}
    case S34{} S1{}:
      S32{}
    case S34{} S2{}:
      S38{}
    case S34{} S3{}:
      S36{}
    case S34{} S4{}:
      S35{}
    case S34{} S5{}:
      S33{}
    case S34{} S6{}:
      S39{}
    case S34{} S7{}:
      S37{}
    case S34{} S8{}:
      S18{}
    case S34{} S9{}:
      S16{}
    case S34{} S10{}:
      S22{}
    case S34{} S11{}:
      S20{}
    case S34{} S12{}:
      S19{}
    case S34{} S13{}:
      S17{}
    case S34{} S14{}:
      S23{}
    case S34{} S15{}:
      S21{}
    case S34{} S16{}:
      S42{}
    case S34{} S17{}:
      S40{}
    case S34{} S18{}:
      S46{}
    case S34{} S19{}:
      S44{}
    case S34{} S20{}:
      S43{}
    case S34{} S21{}:
      S41{}
    case S34{} S22{}:
      S47{}
    case S34{} S23{}:
      S45{}
    case S34{} S24{}:
      S2{}
    case S34{} S25{}:
      S0{}
    case S34{} S26{}:
      S6{}
    case S34{} S27{}:
      S4{}
    case S34{} S28{}:
      S3{}
    case S34{} S29{}:
      S1{}
    case S34{} S30{}:
      S7{}
    case S34{} S31{}:
      S5{}
    case S34{} S32{}:
      S26{}
    case S34{} S33{}:
      S24{}
    case S34{} S34{}:
      S30{}
    case S34{} S35{}:
      S28{}
    case S34{} S36{}:
      S27{}
    case S34{} S37{}:
      S25{}
    case S34{} S38{}:
      S31{}
    case S34{} S39{}:
      S29{}
    case S34{} S40{}:
      S10{}
    case S34{} S41{}:
      S8{}
    case S34{} S42{}:
      S14{}
    case S34{} S43{}:
      S12{}
    case S34{} S44{}:
      S11{}
    case S34{} S45{}:
      S9{}
    case S34{} S46{}:
      S15{}
    case S34{} S47{}:
      S13{}
    case S35{} S0{}:
      S35{}
    case S35{} S1{}:
      S33{}
    case S35{} S2{}:
      S39{}
    case S35{} S3{}:
      S37{}
    case S35{} S4{}:
      S34{}
    case S35{} S5{}:
      S32{}
    case S35{} S6{}:
      S38{}
    case S35{} S7{}:
      S36{}
    case S35{} S8{}:
      S19{}
    case S35{} S9{}:
      S17{}
    case S35{} S10{}:
      S23{}
    case S35{} S11{}:
      S21{}
    case S35{} S12{}:
      S18{}
    case S35{} S13{}:
      S16{}
    case S35{} S14{}:
      S22{}
    case S35{} S15{}:
      S20{}
    case S35{} S16{}:
      S43{}
    case S35{} S17{}:
      S41{}
    case S35{} S18{}:
      S47{}
    case S35{} S19{}:
      S45{}
    case S35{} S20{}:
      S42{}
    case S35{} S21{}:
      S40{}
    case S35{} S22{}:
      S46{}
    case S35{} S23{}:
      S44{}
    case S35{} S24{}:
      S3{}
    case S35{} S25{}:
      S1{}
    case S35{} S26{}:
      S7{}
    case S35{} S27{}:
      S5{}
    case S35{} S28{}:
      S2{}
    case S35{} S29{}:
      S0{}
    case S35{} S30{}:
      S6{}
    case S35{} S31{}:
      S4{}
    case S35{} S32{}:
      S27{}
    case S35{} S33{}:
      S25{}
    case S35{} S34{}:
      S31{}
    case S35{} S35{}:
      S29{}
    case S35{} S36{}:
      S26{}
    case S35{} S37{}:
      S24{}
    case S35{} S38{}:
      S30{}
    case S35{} S39{}:
      S28{}
    case S35{} S40{}:
      S11{}
    case S35{} S41{}:
      S9{}
    case S35{} S42{}:
      S15{}
    case S35{} S43{}:
      S13{}
    case S35{} S44{}:
      S10{}
    case S35{} S45{}:
      S8{}
    case S35{} S46{}:
      S14{}
    case S35{} S47{}:
      S12{}
    case S36{} S0{}:
      S36{}
    case S36{} S1{}:
      S38{}
    case S36{} S2{}:
      S32{}
    case S36{} S3{}:
      S34{}
    case S36{} S4{}:
      S37{}
    case S36{} S5{}:
      S39{}
    case S36{} S6{}:
      S33{}
    case S36{} S7{}:
      S35{}
    case S36{} S8{}:
      S20{}
    case S36{} S9{}:
      S22{}
    case S36{} S10{}:
      S16{}
    case S36{} S11{}:
      S18{}
    case S36{} S12{}:
      S21{}
    case S36{} S13{}:
      S23{}
    case S36{} S14{}:
      S17{}
    case S36{} S15{}:
      S19{}
    case S36{} S16{}:
      S44{}
    case S36{} S17{}:
      S46{}
    case S36{} S18{}:
      S40{}
    case S36{} S19{}:
      S42{}
    case S36{} S20{}:
      S45{}
    case S36{} S21{}:
      S47{}
    case S36{} S22{}:
      S41{}
    case S36{} S23{}:
      S43{}
    case S36{} S24{}:
      S4{}
    case S36{} S25{}:
      S6{}
    case S36{} S26{}:
      S0{}
    case S36{} S27{}:
      S2{}
    case S36{} S28{}:
      S5{}
    case S36{} S29{}:
      S7{}
    case S36{} S30{}:
      S1{}
    case S36{} S31{}:
      S3{}
    case S36{} S32{}:
      S28{}
    case S36{} S33{}:
      S30{}
    case S36{} S34{}:
      S24{}
    case S36{} S35{}:
      S26{}
    case S36{} S36{}:
      S29{}
    case S36{} S37{}:
      S31{}
    case S36{} S38{}:
      S25{}
    case S36{} S39{}:
      S27{}
    case S36{} S40{}:
      S12{}
    case S36{} S41{}:
      S14{}
    case S36{} S42{}:
      S8{}
    case S36{} S43{}:
      S10{}
    case S36{} S44{}:
      S13{}
    case S36{} S45{}:
      S15{}
    case S36{} S46{}:
      S9{}
    case S36{} S47{}:
      S11{}
    case S37{} S0{}:
      S37{}
    case S37{} S1{}:
      S39{}
    case S37{} S2{}:
      S33{}
    case S37{} S3{}:
      S35{}
    case S37{} S4{}:
      S36{}
    case S37{} S5{}:
      S38{}
    case S37{} S6{}:
      S32{}
    case S37{} S7{}:
      S34{}
    case S37{} S8{}:
      S21{}
    case S37{} S9{}:
      S23{}
    case S37{} S10{}:
      S17{}
    case S37{} S11{}:
      S19{}
    case S37{} S12{}:
      S20{}
    case S37{} S13{}:
      S22{}
    case S37{} S14{}:
      S16{}
    case S37{} S15{}:
      S18{}
    case S37{} S16{}:
      S45{}
    case S37{} S17{}:
      S47{}
    case S37{} S18{}:
      S41{}
    case S37{} S19{}:
      S43{}
    case S37{} S20{}:
      S44{}
    case S37{} S21{}:
      S46{}
    case S37{} S22{}:
      S40{}
    case S37{} S23{}:
      S42{}
    case S37{} S24{}:
      S5{}
    case S37{} S25{}:
      S7{}
    case S37{} S26{}:
      S1{}
    case S37{} S27{}:
      S3{}
    case S37{} S28{}:
      S4{}
    case S37{} S29{}:
      S6{}
    case S37{} S30{}:
      S0{}
    case S37{} S31{}:
      S2{}
    case S37{} S32{}:
      S29{}
    case S37{} S33{}:
      S31{}
    case S37{} S34{}:
      S25{}
    case S37{} S35{}:
      S27{}
    case S37{} S36{}:
      S28{}
    case S37{} S37{}:
      S30{}
    case S37{} S38{}:
      S24{}
    case S37{} S39{}:
      S26{}
    case S37{} S40{}:
      S13{}
    case S37{} S41{}:
      S15{}
    case S37{} S42{}:
      S9{}
    case S37{} S43{}:
      S11{}
    case S37{} S44{}:
      S12{}
    case S37{} S45{}:
      S14{}
    case S37{} S46{}:
      S8{}
    case S37{} S47{}:
      S10{}
    case S38{} S0{}:
      S38{}
    case S38{} S1{}:
      S36{}
    case S38{} S2{}:
      S34{}
    case S38{} S3{}:
      S32{}
    case S38{} S4{}:
      S39{}
    case S38{} S5{}:
      S37{}
    case S38{} S6{}:
      S35{}
    case S38{} S7{}:
      S33{}
    case S38{} S8{}:
      S22{}
    case S38{} S9{}:
      S20{}
    case S38{} S10{}:
      S18{}
    case S38{} S11{}:
      S16{}
    case S38{} S12{}:
      S23{}
    case S38{} S13{}:
      S21{}
    case S38{} S14{}:
      S19{}
    case S38{} S15{}:
      S17{}
    case S38{} S16{}:
      S46{}
    case S38{} S17{}:
      S44{}
    case S38{} S18{}:
      S42{}
    case S38{} S19{}:
      S40{}
    case S38{} S20{}:
      S47{}
    case S38{} S21{}:
      S45{}
    case S38{} S22{}:
      S43{}
    case S38{} S23{}:
      S41{}
    case S38{} S24{}:
      S6{}
    case S38{} S25{}:
      S4{}
    case S38{} S26{}:
      S2{}
    case S38{} S27{}:
      S0{}
    case S38{} S28{}:
      S7{}
    case S38{} S29{}:
      S5{}
    case S38{} S30{}:
      S3{}
    case S38{} S31{}:
      S1{}
    case S38{} S32{}:
      S30{}
    case S38{} S33{}:
      S28{}
    case S38{} S34{}:
      S26{}
    case S38{} S35{}:
      S24{}
    case S38{} S36{}:
      S31{}
    case S38{} S37{}:
      S29{}
    case S38{} S38{}:
      S27{}
    case S38{} S39{}:
      S25{}
    case S38{} S40{}:
      S14{}
    case S38{} S41{}:
      S12{}
    case S38{} S42{}:
      S10{}
    case S38{} S43{}:
      S8{}
    case S38{} S44{}:
      S15{}
    case S38{} S45{}:
      S13{}
    case S38{} S46{}:
      S11{}
    case S38{} S47{}:
      S9{}
    case S39{} S0{}:
      S39{}
    case S39{} S1{}:
      S37{}
    case S39{} S2{}:
      S35{}
    case S39{} S3{}:
      S33{}
    case S39{} S4{}:
      S38{}
    case S39{} S5{}:
      S36{}
    case S39{} S6{}:
      S34{}
    case S39{} S7{}:
      S32{}
    case S39{} S8{}:
      S23{}
    case S39{} S9{}:
      S21{}
    case S39{} S10{}:
      S19{}
    case S39{} S11{}:
      S17{}
    case S39{} S12{}:
      S22{}
    case S39{} S13{}:
      S20{}
    case S39{} S14{}:
      S18{}
    case S39{} S15{}:
      S16{}
    case S39{} S16{}:
      S47{}
    case S39{} S17{}:
      S45{}
    case S39{} S18{}:
      S43{}
    case S39{} S19{}:
      S41{}
    case S39{} S20{}:
      S46{}
    case S39{} S21{}:
      S44{}
    case S39{} S22{}:
      S42{}
    case S39{} S23{}:
      S40{}
    case S39{} S24{}:
      S7{}
    case S39{} S25{}:
      S5{}
    case S39{} S26{}:
      S3{}
    case S39{} S27{}:
      S1{}
    case S39{} S28{}:
      S6{}
    case S39{} S29{}:
      S4{}
    case S39{} S30{}:
      S2{}
    case S39{} S31{}:
      S0{}
    case S39{} S32{}:
      S31{}
    case S39{} S33{}:
      S29{}
    case S39{} S34{}:
      S27{}
    case S39{} S35{}:
      S25{}
    case S39{} S36{}:
      S30{}
    case S39{} S37{}:
      S28{}
    case S39{} S38{}:
      S26{}
    case S39{} S39{}:
      S24{}
    case S39{} S40{}:
      S15{}
    case S39{} S41{}:
      S13{}
    case S39{} S42{}:
      S11{}
    case S39{} S43{}:
      S9{}
    case S39{} S44{}:
      S14{}
    case S39{} S45{}:
      S12{}
    case S39{} S46{}:
      S10{}
    case S39{} S47{}:
      S8{}
    case S40{} S0{}:
      S40{}
    case S40{} S1{}:
      S44{}
    case S40{} S2{}:
      S42{}
    case S40{} S3{}:
      S46{}
    case S40{} S4{}:
      S41{}
    case S40{} S5{}:
      S45{}
    case S40{} S6{}:
      S43{}
    case S40{} S7{}:
      S47{}
    case S40{} S8{}:
      S24{}
    case S40{} S9{}:
      S28{}
    case S40{} S10{}:
      S26{}
    case S40{} S11{}:
      S30{}
    case S40{} S12{}:
      S25{}
    case S40{} S13{}:
      S29{}
    case S40{} S14{}:
      S27{}
    case S40{} S15{}:
      S31{}
    case S40{} S16{}:
      S32{}
    case S40{} S17{}:
      S36{}
    case S40{} S18{}:
      S34{}
    case S40{} S19{}:
      S38{}
    case S40{} S20{}:
      S33{}
    case S40{} S21{}:
      S37{}
    case S40{} S22{}:
      S35{}
    case S40{} S23{}:
      S39{}
    case S40{} S24{}:
      S8{}
    case S40{} S25{}:
      S12{}
    case S40{} S26{}:
      S10{}
    case S40{} S27{}:
      S14{}
    case S40{} S28{}:
      S9{}
    case S40{} S29{}:
      S13{}
    case S40{} S30{}:
      S11{}
    case S40{} S31{}:
      S15{}
    case S40{} S32{}:
      S16{}
    case S40{} S33{}:
      S20{}
    case S40{} S34{}:
      S18{}
    case S40{} S35{}:
      S22{}
    case S40{} S36{}:
      S17{}
    case S40{} S37{}:
      S21{}
    case S40{} S38{}:
      S19{}
    case S40{} S39{}:
      S23{}
    case S40{} S40{}:
      S0{}
    case S40{} S41{}:
      S4{}
    case S40{} S42{}:
      S2{}
    case S40{} S43{}:
      S6{}
    case S40{} S44{}:
      S1{}
    case S40{} S45{}:
      S5{}
    case S40{} S46{}:
      S3{}
    case S40{} S47{}:
      S7{}
    case S41{} S0{}:
      S41{}
    case S41{} S1{}:
      S45{}
    case S41{} S2{}:
      S43{}
    case S41{} S3{}:
      S47{}
    case S41{} S4{}:
      S40{}
    case S41{} S5{}:
      S44{}
    case S41{} S6{}:
      S42{}
    case S41{} S7{}:
      S46{}
    case S41{} S8{}:
      S25{}
    case S41{} S9{}:
      S29{}
    case S41{} S10{}:
      S27{}
    case S41{} S11{}:
      S31{}
    case S41{} S12{}:
      S24{}
    case S41{} S13{}:
      S28{}
    case S41{} S14{}:
      S26{}
    case S41{} S15{}:
      S30{}
    case S41{} S16{}:
      S33{}
    case S41{} S17{}:
      S37{}
    case S41{} S18{}:
      S35{}
    case S41{} S19{}:
      S39{}
    case S41{} S20{}:
      S32{}
    case S41{} S21{}:
      S36{}
    case S41{} S22{}:
      S34{}
    case S41{} S23{}:
      S38{}
    case S41{} S24{}:
      S9{}
    case S41{} S25{}:
      S13{}
    case S41{} S26{}:
      S11{}
    case S41{} S27{}:
      S15{}
    case S41{} S28{}:
      S8{}
    case S41{} S29{}:
      S12{}
    case S41{} S30{}:
      S10{}
    case S41{} S31{}:
      S14{}
    case S41{} S32{}:
      S17{}
    case S41{} S33{}:
      S21{}
    case S41{} S34{}:
      S19{}
    case S41{} S35{}:
      S23{}
    case S41{} S36{}:
      S16{}
    case S41{} S37{}:
      S20{}
    case S41{} S38{}:
      S18{}
    case S41{} S39{}:
      S22{}
    case S41{} S40{}:
      S1{}
    case S41{} S41{}:
      S5{}
    case S41{} S42{}:
      S3{}
    case S41{} S43{}:
      S7{}
    case S41{} S44{}:
      S0{}
    case S41{} S45{}:
      S4{}
    case S41{} S46{}:
      S2{}
    case S41{} S47{}:
      S6{}
    case S42{} S0{}:
      S42{}
    case S42{} S1{}:
      S46{}
    case S42{} S2{}:
      S40{}
    case S42{} S3{}:
      S44{}
    case S42{} S4{}:
      S43{}
    case S42{} S5{}:
      S47{}
    case S42{} S6{}:
      S41{}
    case S42{} S7{}:
      S45{}
    case S42{} S8{}:
      S26{}
    case S42{} S9{}:
      S30{}
    case S42{} S10{}:
      S24{}
    case S42{} S11{}:
      S28{}
    case S42{} S12{}:
      S27{}
    case S42{} S13{}:
      S31{}
    case S42{} S14{}:
      S25{}
    case S42{} S15{}:
      S29{}
    case S42{} S16{}:
      S34{}
    case S42{} S17{}:
      S38{}
    case S42{} S18{}:
      S32{}
    case S42{} S19{}:
      S36{}
    case S42{} S20{}:
      S35{}
    case S42{} S21{}:
      S39{}
    case S42{} S22{}:
      S33{}
    case S42{} S23{}:
      S37{}
    case S42{} S24{}:
      S10{}
    case S42{} S25{}:
      S14{}
    case S42{} S26{}:
      S8{}
    case S42{} S27{}:
      S12{}
    case S42{} S28{}:
      S11{}
    case S42{} S29{}:
      S15{}
    case S42{} S30{}:
      S9{}
    case S42{} S31{}:
      S13{}
    case S42{} S32{}:
      S18{}
    case S42{} S33{}:
      S22{}
    case S42{} S34{}:
      S16{}
    case S42{} S35{}:
      S20{}
    case S42{} S36{}:
      S19{}
    case S42{} S37{}:
      S23{}
    case S42{} S38{}:
      S17{}
    case S42{} S39{}:
      S21{}
    case S42{} S40{}:
      S2{}
    case S42{} S41{}:
      S6{}
    case S42{} S42{}:
      S0{}
    case S42{} S43{}:
      S4{}
    case S42{} S44{}:
      S3{}
    case S42{} S45{}:
      S7{}
    case S42{} S46{}:
      S1{}
    case S42{} S47{}:
      S5{}
    case S43{} S0{}:
      S43{}
    case S43{} S1{}:
      S47{}
    case S43{} S2{}:
      S41{}
    case S43{} S3{}:
      S45{}
    case S43{} S4{}:
      S42{}
    case S43{} S5{}:
      S46{}
    case S43{} S6{}:
      S40{}
    case S43{} S7{}:
      S44{}
    case S43{} S8{}:
      S27{}
    case S43{} S9{}:
      S31{}
    case S43{} S10{}:
      S25{}
    case S43{} S11{}:
      S29{}
    case S43{} S12{}:
      S26{}
    case S43{} S13{}:
      S30{}
    case S43{} S14{}:
      S24{}
    case S43{} S15{}:
      S28{}
    case S43{} S16{}:
      S35{}
    case S43{} S17{}:
      S39{}
    case S43{} S18{}:
      S33{}
    case S43{} S19{}:
      S37{}
    case S43{} S20{}:
      S34{}
    case S43{} S21{}:
      S38{}
    case S43{} S22{}:
      S32{}
    case S43{} S23{}:
      S36{}
    case S43{} S24{}:
      S11{}
    case S43{} S25{}:
      S15{}
    case S43{} S26{}:
      S9{}
    case S43{} S27{}:
      S13{}
    case S43{} S28{}:
      S10{}
    case S43{} S29{}:
      S14{}
    case S43{} S30{}:
      S8{}
    case S43{} S31{}:
      S12{}
    case S43{} S32{}:
      S19{}
    case S43{} S33{}:
      S23{}
    case S43{} S34{}:
      S17{}
    case S43{} S35{}:
      S21{}
    case S43{} S36{}:
      S18{}
    case S43{} S37{}:
      S22{}
    case S43{} S38{}:
      S16{}
    case S43{} S39{}:
      S20{}
    case S43{} S40{}:
      S3{}
    case S43{} S41{}:
      S7{}
    case S43{} S42{}:
      S1{}
    case S43{} S43{}:
      S5{}
    case S43{} S44{}:
      S2{}
    case S43{} S45{}:
      S6{}
    case S43{} S46{}:
      S0{}
    case S43{} S47{}:
      S4{}
    case S44{} S0{}:
      S44{}
    case S44{} S1{}:
      S40{}
    case S44{} S2{}:
      S46{}
    case S44{} S3{}:
      S42{}
    case S44{} S4{}:
      S45{}
    case S44{} S5{}:
      S41{}
    case S44{} S6{}:
      S47{}
    case S44{} S7{}:
      S43{}
    case S44{} S8{}:
      S28{}
    case S44{} S9{}:
      S24{}
    case S44{} S10{}:
      S30{}
    case S44{} S11{}:
      S26{}
    case S44{} S12{}:
      S29{}
    case S44{} S13{}:
      S25{}
    case S44{} S14{}:
      S31{}
    case S44{} S15{}:
      S27{}
    case S44{} S16{}:
      S36{}
    case S44{} S17{}:
      S32{}
    case S44{} S18{}:
      S38{}
    case S44{} S19{}:
      S34{}
    case S44{} S20{}:
      S37{}
    case S44{} S21{}:
      S33{}
    case S44{} S22{}:
      S39{}
    case S44{} S23{}:
      S35{}
    case S44{} S24{}:
      S12{}
    case S44{} S25{}:
      S8{}
    case S44{} S26{}:
      S14{}
    case S44{} S27{}:
      S10{}
    case S44{} S28{}:
      S13{}
    case S44{} S29{}:
      S9{}
    case S44{} S30{}:
      S15{}
    case S44{} S31{}:
      S11{}
    case S44{} S32{}:
      S20{}
    case S44{} S33{}:
      S16{}
    case S44{} S34{}:
      S22{}
    case S44{} S35{}:
      S18{}
    case S44{} S36{}:
      S21{}
    case S44{} S37{}:
      S17{}
    case S44{} S38{}:
      S23{}
    case S44{} S39{}:
      S19{}
    case S44{} S40{}:
      S4{}
    case S44{} S41{}:
      S0{}
    case S44{} S42{}:
      S6{}
    case S44{} S43{}:
      S2{}
    case S44{} S44{}:
      S5{}
    case S44{} S45{}:
      S1{}
    case S44{} S46{}:
      S7{}
    case S44{} S47{}:
      S3{}
    case S45{} S0{}:
      S45{}
    case S45{} S1{}:
      S41{}
    case S45{} S2{}:
      S47{}
    case S45{} S3{}:
      S43{}
    case S45{} S4{}:
      S44{}
    case S45{} S5{}:
      S40{}
    case S45{} S6{}:
      S46{}
    case S45{} S7{}:
      S42{}
    case S45{} S8{}:
      S29{}
    case S45{} S9{}:
      S25{}
    case S45{} S10{}:
      S31{}
    case S45{} S11{}:
      S27{}
    case S45{} S12{}:
      S28{}
    case S45{} S13{}:
      S24{}
    case S45{} S14{}:
      S30{}
    case S45{} S15{}:
      S26{}
    case S45{} S16{}:
      S37{}
    case S45{} S17{}:
      S33{}
    case S45{} S18{}:
      S39{}
    case S45{} S19{}:
      S35{}
    case S45{} S20{}:
      S36{}
    case S45{} S21{}:
      S32{}
    case S45{} S22{}:
      S38{}
    case S45{} S23{}:
      S34{}
    case S45{} S24{}:
      S13{}
    case S45{} S25{}:
      S9{}
    case S45{} S26{}:
      S15{}
    case S45{} S27{}:
      S11{}
    case S45{} S28{}:
      S12{}
    case S45{} S29{}:
      S8{}
    case S45{} S30{}:
      S14{}
    case S45{} S31{}:
      S10{}
    case S45{} S32{}:
      S21{}
    case S45{} S33{}:
      S17{}
    case S45{} S34{}:
      S23{}
    case S45{} S35{}:
      S19{}
    case S45{} S36{}:
      S20{}
    case S45{} S37{}:
      S16{}
    case S45{} S38{}:
      S22{}
    case S45{} S39{}:
      S18{}
    case S45{} S40{}:
      S5{}
    case S45{} S41{}:
      S1{}
    case S45{} S42{}:
      S7{}
    case S45{} S43{}:
      S3{}
    case S45{} S44{}:
      S4{}
    case S45{} S45{}:
      S0{}
    case S45{} S46{}:
      S6{}
    case S45{} S47{}:
      S2{}
    case S46{} S0{}:
      S46{}
    case S46{} S1{}:
      S42{}
    case S46{} S2{}:
      S44{}
    case S46{} S3{}:
      S40{}
    case S46{} S4{}:
      S47{}
    case S46{} S5{}:
      S43{}
    case S46{} S6{}:
      S45{}
    case S46{} S7{}:
      S41{}
    case S46{} S8{}:
      S30{}
    case S46{} S9{}:
      S26{}
    case S46{} S10{}:
      S28{}
    case S46{} S11{}:
      S24{}
    case S46{} S12{}:
      S31{}
    case S46{} S13{}:
      S27{}
    case S46{} S14{}:
      S29{}
    case S46{} S15{}:
      S25{}
    case S46{} S16{}:
      S38{}
    case S46{} S17{}:
      S34{}
    case S46{} S18{}:
      S36{}
    case S46{} S19{}:
      S32{}
    case S46{} S20{}:
      S39{}
    case S46{} S21{}:
      S35{}
    case S46{} S22{}:
      S37{}
    case S46{} S23{}:
      S33{}
    case S46{} S24{}:
      S14{}
    case S46{} S25{}:
      S10{}
    case S46{} S26{}:
      S12{}
    case S46{} S27{}:
      S8{}
    case S46{} S28{}:
      S15{}
    case S46{} S29{}:
      S11{}
    case S46{} S30{}:
      S13{}
    case S46{} S31{}:
      S9{}
    case S46{} S32{}:
      S22{}
    case S46{} S33{}:
      S18{}
    case S46{} S34{}:
      S20{}
    case S46{} S35{}:
      S16{}
    case S46{} S36{}:
      S23{}
    case S46{} S37{}:
      S19{}
    case S46{} S38{}:
      S21{}
    case S46{} S39{}:
      S17{}
    case S46{} S40{}:
      S6{}
    case S46{} S41{}:
      S2{}
    case S46{} S42{}:
      S4{}
    case S46{} S43{}:
      S0{}
    case S46{} S44{}:
      S7{}
    case S46{} S45{}:
      S3{}
    case S46{} S46{}:
      S5{}
    case S46{} S47{}:
      S1{}
    case S47{} S0{}:
      S47{}
    case S47{} S1{}:
      S43{}
    case S47{} S2{}:
      S45{}
    case S47{} S3{}:
      S41{}
    case S47{} S4{}:
      S46{}
    case S47{} S5{}:
      S42{}
    case S47{} S6{}:
      S44{}
    case S47{} S7{}:
      S40{}
    case S47{} S8{}:
      S31{}
    case S47{} S9{}:
      S27{}
    case S47{} S10{}:
      S29{}
    case S47{} S11{}:
      S25{}
    case S47{} S12{}:
      S30{}
    case S47{} S13{}:
      S26{}
    case S47{} S14{}:
      S28{}
    case S47{} S15{}:
      S24{}
    case S47{} S16{}:
      S39{}
    case S47{} S17{}:
      S35{}
    case S47{} S18{}:
      S37{}
    case S47{} S19{}:
      S33{}
    case S47{} S20{}:
      S38{}
    case S47{} S21{}:
      S34{}
    case S47{} S22{}:
      S36{}
    case S47{} S23{}:
      S32{}
    case S47{} S24{}:
      S15{}
    case S47{} S25{}:
      S11{}
    case S47{} S26{}:
      S13{}
    case S47{} S27{}:
      S9{}
    case S47{} S28{}:
      S14{}
    case S47{} S29{}:
      S10{}
    case S47{} S30{}:
      S12{}
    case S47{} S31{}:
      S8{}
    case S47{} S32{}:
      S23{}
    case S47{} S33{}:
      S19{}
    case S47{} S34{}:
      S21{}
    case S47{} S35{}:
      S17{}
    case S47{} S36{}:
      S22{}
    case S47{} S37{}:
      S18{}
    case S47{} S38{}:
      S20{}
    case S47{} S39{}:
      S16{}
    case S47{} S40{}:
      S7{}
    case S47{} S41{}:
      S3{}
    case S47{} S42{}:
      S5{}
    case S47{} S43{}:
      S1{}
    case S47{} S44{}:
      S6{}
    case S47{} S45{}:
      S2{}
    case S47{} S46{}:
      S4{}
    case S47{} S47{}:
      S0{}

def color_0(value: U32) -> U32:
  value

def color_1(value: U32) -> U32:
  match value:
    case 0: 0
    case 1: 4
    case 2: 2
    case 3: 3
    case 4: 1
    case 5: 5
    case value: value

def color_2(value: U32) -> U32:
  match value:
    case 0: 3
    case 1: 1
    case 2: 2
    case 3: 0
    case 4: 4
    case 5: 5
    case value: value

def color_3(value: U32) -> U32:
  match value:
    case 0: 3
    case 1: 4
    case 2: 2
    case 3: 0
    case 4: 1
    case 5: 5
    case value: value

def color_4(value: U32) -> U32:
  match value:
    case 0: 0
    case 1: 1
    case 2: 5
    case 3: 3
    case 4: 4
    case 5: 2
    case value: value

def color_5(value: U32) -> U32:
  match value:
    case 0: 0
    case 1: 4
    case 2: 5
    case 3: 3
    case 4: 1
    case 5: 2
    case value: value

def color_6(value: U32) -> U32:
  match value:
    case 0: 3
    case 1: 1
    case 2: 5
    case 3: 0
    case 4: 4
    case 5: 2
    case value: value

def color_7(value: U32) -> U32:
  match value:
    case 0: 3
    case 1: 4
    case 2: 5
    case 3: 0
    case 4: 1
    case 5: 2
    case value: value

def color_8(value: U32) -> U32:
  match value:
    case 0: 2
    case 1: 1
    case 2: 0
    case 3: 5
    case 4: 4
    case 5: 3
    case value: value

def color_9(value: U32) -> U32:
  match value:
    case 0: 2
    case 1: 4
    case 2: 0
    case 3: 5
    case 4: 1
    case 5: 3
    case value: value

def color_10(value: U32) -> U32:
  match value:
    case 0: 2
    case 1: 1
    case 2: 3
    case 3: 5
    case 4: 4
    case 5: 0
    case value: value

def color_11(value: U32) -> U32:
  match value:
    case 0: 2
    case 1: 4
    case 2: 3
    case 3: 5
    case 4: 1
    case 5: 0
    case value: value

def color_12(value: U32) -> U32:
  match value:
    case 0: 5
    case 1: 1
    case 2: 0
    case 3: 2
    case 4: 4
    case 5: 3
    case value: value

def color_13(value: U32) -> U32:
  match value:
    case 0: 5
    case 1: 4
    case 2: 0
    case 3: 2
    case 4: 1
    case 5: 3
    case value: value

def color_14(value: U32) -> U32:
  match value:
    case 0: 5
    case 1: 1
    case 2: 3
    case 3: 2
    case 4: 4
    case 5: 0
    case value: value

def color_15(value: U32) -> U32:
  match value:
    case 0: 5
    case 1: 4
    case 2: 3
    case 3: 2
    case 4: 1
    case 5: 0
    case value: value

def color_16(value: U32) -> U32:
  match value:
    case 0: 1
    case 1: 0
    case 2: 2
    case 3: 4
    case 4: 3
    case 5: 5
    case value: value

def color_17(value: U32) -> U32:
  match value:
    case 0: 4
    case 1: 0
    case 2: 2
    case 3: 1
    case 4: 3
    case 5: 5
    case value: value

def color_18(value: U32) -> U32:
  match value:
    case 0: 1
    case 1: 3
    case 2: 2
    case 3: 4
    case 4: 0
    case 5: 5
    case value: value

def color_19(value: U32) -> U32:
  match value:
    case 0: 4
    case 1: 3
    case 2: 2
    case 3: 1
    case 4: 0
    case 5: 5
    case value: value

def color_20(value: U32) -> U32:
  match value:
    case 0: 1
    case 1: 0
    case 2: 5
    case 3: 4
    case 4: 3
    case 5: 2
    case value: value

def color_21(value: U32) -> U32:
  match value:
    case 0: 4
    case 1: 0
    case 2: 5
    case 3: 1
    case 4: 3
    case 5: 2
    case value: value

def color_22(value: U32) -> U32:
  match value:
    case 0: 1
    case 1: 3
    case 2: 5
    case 3: 4
    case 4: 0
    case 5: 2
    case value: value

def color_23(value: U32) -> U32:
  match value:
    case 0: 4
    case 1: 3
    case 2: 5
    case 3: 1
    case 4: 0
    case 5: 2
    case value: value

def color_24(value: U32) -> U32:
  match value:
    case 0: 1
    case 1: 2
    case 2: 0
    case 3: 4
    case 4: 5
    case 5: 3
    case value: value

def color_25(value: U32) -> U32:
  match value:
    case 0: 4
    case 1: 2
    case 2: 0
    case 3: 1
    case 4: 5
    case 5: 3
    case value: value

def color_26(value: U32) -> U32:
  match value:
    case 0: 1
    case 1: 2
    case 2: 3
    case 3: 4
    case 4: 5
    case 5: 0
    case value: value

def color_27(value: U32) -> U32:
  match value:
    case 0: 4
    case 1: 2
    case 2: 3
    case 3: 1
    case 4: 5
    case 5: 0
    case value: value

def color_28(value: U32) -> U32:
  match value:
    case 0: 1
    case 1: 5
    case 2: 0
    case 3: 4
    case 4: 2
    case 5: 3
    case value: value

def color_29(value: U32) -> U32:
  match value:
    case 0: 4
    case 1: 5
    case 2: 0
    case 3: 1
    case 4: 2
    case 5: 3
    case value: value

def color_30(value: U32) -> U32:
  match value:
    case 0: 1
    case 1: 5
    case 2: 3
    case 3: 4
    case 4: 2
    case 5: 0
    case value: value

def color_31(value: U32) -> U32:
  match value:
    case 0: 4
    case 1: 5
    case 2: 3
    case 3: 1
    case 4: 2
    case 5: 0
    case value: value

def color_32(value: U32) -> U32:
  match value:
    case 0: 2
    case 1: 0
    case 2: 1
    case 3: 5
    case 4: 3
    case 5: 4
    case value: value

def color_33(value: U32) -> U32:
  match value:
    case 0: 2
    case 1: 0
    case 2: 4
    case 3: 5
    case 4: 3
    case 5: 1
    case value: value

def color_34(value: U32) -> U32:
  match value:
    case 0: 2
    case 1: 3
    case 2: 1
    case 3: 5
    case 4: 0
    case 5: 4
    case value: value

def color_35(value: U32) -> U32:
  match value:
    case 0: 2
    case 1: 3
    case 2: 4
    case 3: 5
    case 4: 0
    case 5: 1
    case value: value

def color_36(value: U32) -> U32:
  match value:
    case 0: 5
    case 1: 0
    case 2: 1
    case 3: 2
    case 4: 3
    case 5: 4
    case value: value

def color_37(value: U32) -> U32:
  match value:
    case 0: 5
    case 1: 0
    case 2: 4
    case 3: 2
    case 4: 3
    case 5: 1
    case value: value

def color_38(value: U32) -> U32:
  match value:
    case 0: 5
    case 1: 3
    case 2: 1
    case 3: 2
    case 4: 0
    case 5: 4
    case value: value

def color_39(value: U32) -> U32:
  match value:
    case 0: 5
    case 1: 3
    case 2: 4
    case 3: 2
    case 4: 0
    case 5: 1
    case value: value

def color_40(value: U32) -> U32:
  match value:
    case 0: 0
    case 1: 2
    case 2: 1
    case 3: 3
    case 4: 5
    case 5: 4
    case value: value

def color_41(value: U32) -> U32:
  match value:
    case 0: 0
    case 1: 2
    case 2: 4
    case 3: 3
    case 4: 5
    case 5: 1
    case value: value

def color_42(value: U32) -> U32:
  match value:
    case 0: 3
    case 1: 2
    case 2: 1
    case 3: 0
    case 4: 5
    case 5: 4
    case value: value

def color_43(value: U32) -> U32:
  match value:
    case 0: 3
    case 1: 2
    case 2: 4
    case 3: 0
    case 4: 5
    case 5: 1
    case value: value

def color_44(value: U32) -> U32:
  match value:
    case 0: 0
    case 1: 5
    case 2: 1
    case 3: 3
    case 4: 2
    case 5: 4
    case value: value

def color_45(value: U32) -> U32:
  match value:
    case 0: 0
    case 1: 5
    case 2: 4
    case 3: 3
    case 4: 2
    case 5: 1
    case value: value

def color_46(value: U32) -> U32:
  match value:
    case 0: 3
    case 1: 5
    case 2: 1
    case 3: 0
    case 4: 2
    case 5: 4
    case value: value

def color_47(value: U32) -> U32:
  match value:
    case 0: 3
    case 1: 5
    case 2: 4
    case 3: 0
    case 4: 2
    case 5: 1
    case value: value

def known_color(sym: Symmetry, value: U32) -> U32:
  match sym:
    case S0{}:
      color_0(value)
    case S1{}:
      color_1(value)
    case S2{}:
      color_2(value)
    case S3{}:
      color_3(value)
    case S4{}:
      color_4(value)
    case S5{}:
      color_5(value)
    case S6{}:
      color_6(value)
    case S7{}:
      color_7(value)
    case S8{}:
      color_8(value)
    case S9{}:
      color_9(value)
    case S10{}:
      color_10(value)
    case S11{}:
      color_11(value)
    case S12{}:
      color_12(value)
    case S13{}:
      color_13(value)
    case S14{}:
      color_14(value)
    case S15{}:
      color_15(value)
    case S16{}:
      color_16(value)
    case S17{}:
      color_17(value)
    case S18{}:
      color_18(value)
    case S19{}:
      color_19(value)
    case S20{}:
      color_20(value)
    case S21{}:
      color_21(value)
    case S22{}:
      color_22(value)
    case S23{}:
      color_23(value)
    case S24{}:
      color_24(value)
    case S25{}:
      color_25(value)
    case S26{}:
      color_26(value)
    case S27{}:
      color_27(value)
    case S28{}:
      color_28(value)
    case S29{}:
      color_29(value)
    case S30{}:
      color_30(value)
    case S31{}:
      color_31(value)
    case S32{}:
      color_32(value)
    case S33{}:
      color_33(value)
    case S34{}:
      color_34(value)
    case S35{}:
      color_35(value)
    case S36{}:
      color_36(value)
    case S37{}:
      color_37(value)
    case S38{}:
      color_38(value)
    case S39{}:
      color_39(value)
    case S40{}:
      color_40(value)
    case S41{}:
      color_41(value)
    case S42{}:
      color_42(value)
    case S43{}:
      color_43(value)
    case S44{}:
      color_44(value)
    case S45{}:
      color_45(value)
    case S46{}:
      color_46(value)
    case S47{}:
      color_47(value)

def color_bits(b31: Bool, b30: Bool, b29: Bool, b28: Bool, b27: Bool, b26: Bool, b25: Bool, b24: Bool, b23: Bool, b22: Bool, b21: Bool, b20: Bool, b19: Bool, b18: Bool, b17: Bool, b16: Bool, b15: Bool, b14: Bool, b13: Bool, b12: Bool, b11: Bool, b10: Bool, b9: Bool, b8: Bool, b7: Bool, b6: Bool, b5: Bool, b4: Bool, b3: Bool, b2: Bool, b1: Bool, b0: Bool, sym: Symmetry, value: U32) -> U32:
  match b31:
    case True{}:
      value
    case False{}:
      match b30:
        case True{}:
          value
        case False{}:
          match b29:
            case True{}:
              value
            case False{}:
              match b28:
                case True{}:
                  value
                case False{}:
                  match b27:
                    case True{}:
                      value
                    case False{}:
                      match b26:
                        case True{}:
                          value
                        case False{}:
                          match b25:
                            case True{}:
                              value
                            case False{}:
                              match b24:
                                case True{}:
                                  value
                                case False{}:
                                  match b23:
                                    case True{}:
                                      value
                                    case False{}:
                                      match b22:
                                        case True{}:
                                          value
                                        case False{}:
                                          match b21:
                                            case True{}:
                                              value
                                            case False{}:
                                              match b20:
                                                case True{}:
                                                  value
                                                case False{}:
                                                  match b19:
                                                    case True{}:
                                                      value
                                                    case False{}:
                                                      match b18:
                                                        case True{}:
                                                          value
                                                        case False{}:
                                                          match b17:
                                                            case True{}:
                                                              value
                                                            case False{}:
                                                              match b16:
                                                                case True{}:
                                                                  value
                                                                case False{}:
                                                                  match b15:
                                                                    case True{}:
                                                                      value
                                                                    case False{}:
                                                                      match b14:
                                                                        case True{}:
                                                                          value
                                                                        case False{}:
                                                                          match b13:
                                                                            case True{}:
                                                                              value
                                                                            case False{}:
                                                                              match b12:
                                                                                case True{}:
                                                                                  value
                                                                                case False{}:
                                                                                  match b11:
                                                                                    case True{}:
                                                                                      value
                                                                                    case False{}:
                                                                                      match b10:
                                                                                        case True{}:
                                                                                          value
                                                                                        case False{}:
                                                                                          match b9:
                                                                                            case True{}:
                                                                                              value
                                                                                            case False{}:
                                                                                              match b8:
                                                                                                case True{}:
                                                                                                  value
                                                                                                case False{}:
                                                                                                  match b7:
                                                                                                    case True{}:
                                                                                                      value
                                                                                                    case False{}:
                                                                                                      match b6:
                                                                                                        case True{}:
                                                                                                          value
                                                                                                        case False{}:
                                                                                                          match b5:
                                                                                                            case True{}:
                                                                                                              value
                                                                                                            case False{}:
                                                                                                              match b4:
                                                                                                                case True{}:
                                                                                                                  value
                                                                                                                case False{}:
                                                                                                                  match b3:
                                                                                                                    case True{}:
                                                                                                                      value
                                                                                                                    case False{}:
                                                                                                                      match b2 b1 b0:
                                                                                                                        case False{} False{} False{}:
                                                                                                                          known_color(sym, 0)
                                                                                                                        case False{} False{} True{}:
                                                                                                                          known_color(sym, 1)
                                                                                                                        case False{} True{} False{}:
                                                                                                                          known_color(sym, 2)
                                                                                                                        case False{} True{} True{}:
                                                                                                                          known_color(sym, 3)
                                                                                                                        case True{} False{} False{}:
                                                                                                                          known_color(sym, 4)
                                                                                                                        case True{} False{} True{}:
                                                                                                                          known_color(sym, 5)
                                                                                                                        case True{} True{} False{}:
                                                                                                                          value
                                                                                                                        case True{} True{} True{}:
                                                                                                                          value

def color(sym: Symmetry, +value: U32) -> U32:
  match value:
    case U32{WCon{b0, WCon{b1, WCon{b2, WCon{b3, WCon{b4, WCon{b5, WCon{b6, WCon{b7, WCon{b8, WCon{b9, WCon{b10, WCon{b11, WCon{b12, WCon{b13, WCon{b14, WCon{b15, WCon{b16, WCon{b17, WCon{b18, WCon{b19, WCon{b20, WCon{b21, WCon{b22, WCon{b23, WCon{b24, WCon{b25, WCon{b26, WCon{b27, WCon{b28, WCon{b29, WCon{b30, WCon{b31, WNil{}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}:
      color_bits(b31, b30, b29, b28, b27, b26, b25, b24, b23, b22, b21, b20, b19, b18, b17, b16, b15, b14, b13, b12, b11, b10, b9, b8, b7, b6, b5, b4, b3, b2, b1, b0, sym, value)

def permute(sym: Symmetry, cube: M.Cube) -> M.Cube:
  match sym cube:
    case S0{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}
    case S1{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s2, s1, s0, s5, s4, s3, s8, s7, s6, s38, s37, s36, s41, s40, s39, s44, s43, s42, s20, s19, s18, s23, s22, s21, s26, s25, s24, s29, s28, s27, s32, s31, s30, s35, s34, s33, s11, s10, s9, s14, s13, s12, s17, s16, s15, s47, s46, s45, s50, s49, s48, s53, s52, s51}
    case S2{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s33, s34, s35, s30, s31, s32, s27, s28, s29, s15, s16, s17, s12, s13, s14, s9, s10, s11, s24, s25, s26, s21, s22, s23, s18, s19, s20, s6, s7, s8, s3, s4, s5, s0, s1, s2, s42, s43, s44, s39, s40, s41, s36, s37, s38, s51, s52, s53, s48, s49, s50, s45, s46, s47}
    case S3{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s35, s34, s33, s32, s31, s30, s29, s28, s27, s44, s43, s42, s41, s40, s39, s38, s37, s36, s26, s25, s24, s23, s22, s21, s20, s19, s18, s8, s7, s6, s5, s4, s3, s2, s1, s0, s17, s16, s15, s14, s13, s12, s11, s10, s9, s53, s52, s51, s50, s49, s48, s47, s46, s45}
    case S4{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s6, s7, s8, s3, s4, s5, s0, s1, s2, s11, s10, s9, s14, s13, s12, s17, s16, s15, s47, s46, s45, s50, s49, s48, s53, s52, s51, s33, s34, s35, s30, s31, s32, s27, s28, s29, s38, s37, s36, s41, s40, s39, s44, s43, s42, s20, s19, s18, s23, s22, s21, s26, s25, s24}
    case S5{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s8, s7, s6, s5, s4, s3, s2, s1, s0, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53, s35, s34, s33, s32, s31, s30, s29, s28, s27, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26}
    case S6{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s27, s28, s29, s30, s31, s32, s33, s34, s35, s17, s16, s15, s14, s13, s12, s11, s10, s9, s53, s52, s51, s50, s49, s48, s47, s46, s45, s0, s1, s2, s3, s4, s5, s6, s7, s8, s44, s43, s42, s41, s40, s39, s38, s37, s36, s26, s25, s24, s23, s22, s21, s20, s19, s18}
    case S7{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s29, s28, s27, s32, s31, s30, s35, s34, s33, s42, s43, s44, s39, s40, s41, s36, s37, s38, s51, s52, s53, s48, s49, s50, s45, s46, s47, s2, s1, s0, s5, s4, s3, s8, s7, s6, s15, s16, s17, s12, s13, s14, s9, s10, s11, s24, s25, s26, s21, s22, s23, s18, s19, s20}
    case S8{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s24, s25, s26, s21, s22, s23, s18, s19, s20, s9, s12, s15, s10, s13, s16, s11, s14, s17, s6, s7, s8, s3, s4, s5, s0, s1, s2, s47, s46, s45, s50, s49, s48, s53, s52, s51, s44, s41, s38, s43, s40, s37, s42, s39, s36, s29, s28, s27, s32, s31, s30, s35, s34, s33}
    case S9{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s26, s25, s24, s23, s22, s21, s20, s19, s18, s38, s41, s44, s37, s40, s43, s36, s39, s42, s8, s7, s6, s5, s4, s3, s2, s1, s0, s45, s46, s47, s48, s49, s50, s51, s52, s53, s15, s12, s9, s16, s13, s10, s17, s14, s11, s27, s28, s29, s30, s31, s32, s33, s34, s35}
    case S10{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s53, s52, s51, s50, s49, s48, s47, s46, s45, s11, s14, s17, s10, s13, s16, s9, s12, s15, s0, s1, s2, s3, s4, s5, s6, s7, s8, s18, s19, s20, s21, s22, s23, s24, s25, s26, s42, s39, s36, s43, s40, s37, s44, s41, s38, s35, s34, s33, s32, s31, s30, s29, s28, s27}
    case S11{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s51, s52, s53, s48, s49, s50, s45, s46, s47, s36, s39, s42, s37, s40, s43, s38, s41, s44, s2, s1, s0, s5, s4, s3, s8, s7, s6, s20, s19, s18, s23, s22, s21, s26, s25, s24, s17, s14, s11, s16, s13, s10, s15, s12, s9, s33, s34, s35, s30, s31, s32, s27, s28, s29}
    case S12{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s18, s19, s20, s21, s22, s23, s24, s25, s26, s15, s12, s9, s16, s13, s10, s17, s14, s11, s27, s28, s29, s30, s31, s32, s33, s34, s35, s53, s52, s51, s50, s49, s48, s47, s46, s45, s38, s41, s44, s37, s40, s43, s36, s39, s42, s8, s7, s6, s5, s4, s3, s2, s1, s0}
    case S13{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s20, s19, s18, s23, s22, s21, s26, s25, s24, s44, s41, s38, s43, s40, s37, s42, s39, s36, s29, s28, s27, s32, s31, s30, s35, s34, s33, s51, s52, s53, s48, s49, s50, s45, s46, s47, s9, s12, s15, s10, s13, s16, s11, s14, s17, s6, s7, s8, s3, s4, s5, s0, s1, s2}
    case S14{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s47, s46, s45, s50, s49, s48, s53, s52, s51, s17, s14, s11, s16, s13, s10, s15, s12, s9, s33, s34, s35, s30, s31, s32, s27, s28, s29, s24, s25, s26, s21, s22, s23, s18, s19, s20, s36, s39, s42, s37, s40, s43, s38, s41, s44, s2, s1, s0, s5, s4, s3, s8, s7, s6}
    case S15{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s45, s46, s47, s48, s49, s50, s51, s52, s53, s42, s39, s36, s43, s40, s37, s44, s41, s38, s35, s34, s33, s32, s31, s30, s29, s28, s27, s26, s25, s24, s23, s22, s21, s20, s19, s18, s11, s14, s17, s10, s13, s16, s9, s12, s15, s0, s1, s2, s3, s4, s5, s6, s7, s8}
    case S16{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s17, s14, s11, s16, s13, s10, s15, s12, s9, s8, s5, s2, s7, s4, s1, s6, s3, s0, s26, s23, s20, s25, s22, s19, s24, s21, s18, s44, s41, s38, s43, s40, s37, s42, s39, s36, s35, s32, s29, s34, s31, s28, s33, s30, s27, s45, s48, s51, s46, s49, s52, s47, s50, s53}
    case S17{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s11, s14, s17, s10, s13, s16, s9, s12, s15, s29, s32, s35, s28, s31, s34, s27, s30, s33, s20, s23, s26, s19, s22, s25, s18, s21, s24, s38, s41, s44, s37, s40, s43, s36, s39, s42, s2, s5, s8, s1, s4, s7, s0, s3, s6, s51, s48, s45, s52, s49, s46, s53, s50, s47}
    case S18{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s42, s39, s36, s43, s40, s37, s44, s41, s38, s6, s3, s0, s7, s4, s1, s8, s5, s2, s24, s21, s18, s25, s22, s19, s26, s23, s20, s15, s12, s9, s16, s13, s10, s17, s14, s11, s33, s30, s27, s34, s31, s28, s35, s32, s29, s47, s50, s53, s46, s49, s52, s45, s48, s51}
    case S19{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s36, s39, s42, s37, s40, s43, s38, s41, s44, s27, s30, s33, s28, s31, s34, s29, s32, s35, s18, s21, s24, s19, s22, s25, s20, s23, s26, s9, s12, s15, s10, s13, s16, s11, s14, s17, s0, s3, s6, s1, s4, s7, s2, s5, s8, s53, s50, s47, s52, s49, s46, s51, s48, s45}
    case S20{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s15, s12, s9, s16, s13, s10, s17, s14, s11, s2, s5, s8, s1, s4, s7, s0, s3, s6, s51, s48, s45, s52, s49, s46, s53, s50, s47, s42, s39, s36, s43, s40, s37, s44, s41, s38, s29, s32, s35, s28, s31, s34, s27, s30, s33, s20, s23, s26, s19, s22, s25, s18, s21, s24}
    case S21{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s9, s12, s15, s10, s13, s16, s11, s14, s17, s35, s32, s29, s34, s31, s28, s33, s30, s27, s45, s48, s51, s46, s49, s52, s47, s50, s53, s36, s39, s42, s37, s40, s43, s38, s41, s44, s8, s5, s2, s7, s4, s1, s6, s3, s0, s26, s23, s20, s25, s22, s19, s24, s21, s18}
    case S22{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s44, s41, s38, s43, s40, s37, s42, s39, s36, s0, s3, s6, s1, s4, s7, s2, s5, s8, s53, s50, s47, s52, s49, s46, s51, s48, s45, s17, s14, s11, s16, s13, s10, s15, s12, s9, s27, s30, s33, s28, s31, s34, s29, s32, s35, s18, s21, s24, s19, s22, s25, s20, s23, s26}
    case S23{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s38, s41, s44, s37, s40, s43, s36, s39, s42, s33, s30, s27, s34, s31, s28, s35, s32, s29, s47, s50, s53, s46, s49, s52, s45, s48, s51, s11, s14, s17, s10, s13, s16, s9, s12, s15, s6, s3, s0, s7, s4, s1, s8, s5, s2, s24, s21, s18, s25, s22, s19, s26, s23, s20}
    case S24{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s24, s21, s18, s25, s22, s19, s26, s23, s20, s8, s7, s6, s5, s4, s3, s2, s1, s0, s15, s12, s9, s16, s13, s10, s17, s14, s11, s51, s48, s45, s52, s49, s46, s53, s50, s47, s27, s28, s29, s30, s31, s32, s33, s34, s35, s38, s41, s44, s37, s40, s43, s36, s39, s42}
    case S25{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s18, s21, s24, s19, s22, s25, s20, s23, s26, s29, s28, s27, s32, s31, s30, s35, s34, s33, s9, s12, s15, s10, s13, s16, s11, s14, s17, s45, s48, s51, s46, s49, s52, s47, s50, s53, s6, s7, s8, s3, s4, s5, s0, s1, s2, s44, s41, s38, s43, s40, s37, s42, s39, s36}
    case S26{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s53, s50, s47, s52, s49, s46, s51, s48, s45, s2, s1, s0, s5, s4, s3, s8, s7, s6, s17, s14, s11, s16, s13, s10, s15, s12, s9, s26, s23, s20, s25, s22, s19, s24, s21, s18, s33, s34, s35, s30, s31, s32, s27, s28, s29, s36, s39, s42, s37, s40, s43, s38, s41, s44}
    case S27{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s47, s50, s53, s46, s49, s52, s45, s48, s51, s35, s34, s33, s32, s31, s30, s29, s28, s27, s11, s14, s17, s10, s13, s16, s9, s12, s15, s20, s23, s26, s19, s22, s25, s18, s21, s24, s0, s1, s2, s3, s4, s5, s6, s7, s8, s42, s39, s36, s43, s40, s37, s44, s41, s38}
    case S28{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s26, s23, s20, s25, s22, s19, s24, s21, s18, s6, s7, s8, s3, s4, s5, s0, s1, s2, s44, s41, s38, s43, s40, s37, s42, s39, s36, s53, s50, s47, s52, s49, s46, s51, s48, s45, s29, s28, s27, s32, s31, s30, s35, s34, s33, s9, s12, s15, s10, s13, s16, s11, s14, s17}
    case S29{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s20, s23, s26, s19, s22, s25, s18, s21, s24, s27, s28, s29, s30, s31, s32, s33, s34, s35, s38, s41, s44, s37, s40, s43, s36, s39, s42, s47, s50, s53, s46, s49, s52, s45, s48, s51, s8, s7, s6, s5, s4, s3, s2, s1, s0, s15, s12, s9, s16, s13, s10, s17, s14, s11}
    case S30{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s51, s48, s45, s52, s49, s46, s53, s50, s47, s0, s1, s2, s3, s4, s5, s6, s7, s8, s42, s39, s36, s43, s40, s37, s44, s41, s38, s24, s21, s18, s25, s22, s19, s26, s23, s20, s35, s34, s33, s32, s31, s30, s29, s28, s27, s11, s14, s17, s10, s13, s16, s9, s12, s15}
    case S31{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s45, s48, s51, s46, s49, s52, s47, s50, s53, s33, s34, s35, s30, s31, s32, s27, s28, s29, s36, s39, s42, s37, s40, s43, s38, s41, s44, s18, s21, s24, s19, s22, s25, s20, s23, s26, s2, s1, s0, s5, s4, s3, s8, s7, s6, s17, s14, s11, s16, s13, s10, s15, s12, s9}
    case S32{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s17, s16, s15, s14, s13, s12, s11, s10, s9, s20, s23, s26, s19, s22, s25, s18, s21, s24, s2, s5, s8, s1, s4, s7, s0, s3, s6, s36, s37, s38, s39, s40, s41, s42, s43, s44, s51, s48, s45, s52, s49, s46, s53, s50, s47, s29, s32, s35, s28, s31, s34, s27, s30, s33}
    case S33{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s15, s16, s17, s12, s13, s14, s9, s10, s11, s45, s48, s51, s46, s49, s52, s47, s50, s53, s8, s5, s2, s7, s4, s1, s6, s3, s0, s38, s37, s36, s41, s40, s39, s44, s43, s42, s26, s23, s20, s25, s22, s19, s24, s21, s18, s35, s32, s29, s34, s31, s28, s33, s30, s27}
    case S34{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s42, s43, s44, s39, s40, s41, s36, s37, s38, s18, s21, s24, s19, s22, s25, s20, s23, s26, s0, s3, s6, s1, s4, s7, s2, s5, s8, s11, s10, s9, s14, s13, s12, s17, s16, s15, s53, s50, s47, s52, s49, s46, s51, s48, s45, s27, s30, s33, s28, s31, s34, s29, s32, s35}
    case S35{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s44, s43, s42, s41, s40, s39, s38, s37, s36, s47, s50, s53, s46, s49, s52, s45, s48, s51, s6, s3, s0, s7, s4, s1, s8, s5, s2, s9, s10, s11, s12, s13, s14, s15, s16, s17, s24, s21, s18, s25, s22, s19, s26, s23, s20, s33, s30, s27, s34, s31, s28, s35, s32, s29}
    case S36{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s11, s10, s9, s14, s13, s12, s17, s16, s15, s26, s23, s20, s25, s22, s19, s24, s21, s18, s35, s32, s29, s34, s31, s28, s33, s30, s27, s42, s43, s44, s39, s40, s41, s36, s37, s38, s45, s48, s51, s46, s49, s52, s47, s50, s53, s8, s5, s2, s7, s4, s1, s6, s3, s0}
    case S37{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s9, s10, s11, s12, s13, s14, s15, s16, s17, s51, s48, s45, s52, s49, s46, s53, s50, s47, s29, s32, s35, s28, s31, s34, s27, s30, s33, s44, s43, s42, s41, s40, s39, s38, s37, s36, s20, s23, s26, s19, s22, s25, s18, s21, s24, s2, s5, s8, s1, s4, s7, s0, s3, s6}
    case S38{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s36, s37, s38, s39, s40, s41, s42, s43, s44, s24, s21, s18, s25, s22, s19, s26, s23, s20, s33, s30, s27, s34, s31, s28, s35, s32, s29, s17, s16, s15, s14, s13, s12, s11, s10, s9, s47, s50, s53, s46, s49, s52, s45, s48, s51, s6, s3, s0, s7, s4, s1, s8, s5, s2}
    case S39{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s38, s37, s36, s41, s40, s39, s44, s43, s42, s53, s50, s47, s52, s49, s46, s51, s48, s45, s27, s30, s33, s28, s31, s34, s29, s32, s35, s15, s16, s17, s12, s13, s14, s9, s10, s11, s18, s21, s24, s19, s22, s25, s20, s23, s26, s0, s3, s6, s1, s4, s7, s2, s5, s8}
    case S40{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s0, s3, s6, s1, s4, s7, s2, s5, s8, s20, s19, s18, s23, s22, s21, s26, s25, s24, s11, s10, s9, s14, s13, s12, s17, s16, s15, s35, s32, s29, s34, s31, s28, s33, s30, s27, s47, s46, s45, s50, s49, s48, s53, s52, s51, s38, s37, s36, s41, s40, s39, s44, s43, s42}
    case S41{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s6, s3, s0, s7, s4, s1, s8, s5, s2, s45, s46, s47, s48, s49, s50, s51, s52, s53, s9, s10, s11, s12, s13, s14, s15, s16, s17, s29, s32, s35, s28, s31, s34, s27, s30, s33, s18, s19, s20, s21, s22, s23, s24, s25, s26, s36, s37, s38, s39, s40, s41, s42, s43, s44}
    case S42{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s33, s30, s27, s34, s31, s28, s35, s32, s29, s26, s25, s24, s23, s22, s21, s20, s19, s18, s17, s16, s15, s14, s13, s12, s11, s10, s9, s2, s5, s8, s1, s4, s7, s0, s3, s6, s53, s52, s51, s50, s49, s48, s47, s46, s45, s44, s43, s42, s41, s40, s39, s38, s37, s36}
    case S43{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s27, s30, s33, s28, s31, s34, s29, s32, s35, s51, s52, s53, s48, s49, s50, s45, s46, s47, s15, s16, s17, s12, s13, s14, s9, s10, s11, s8, s5, s2, s7, s4, s1, s6, s3, s0, s24, s25, s26, s21, s22, s23, s18, s19, s20, s42, s43, s44, s39, s40, s41, s36, s37, s38}
    case S44{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s2, s5, s8, s1, s4, s7, s0, s3, s6, s18, s19, s20, s21, s22, s23, s24, s25, s26, s36, s37, s38, s39, s40, s41, s42, s43, s44, s33, s30, s27, s34, s31, s28, s35, s32, s29, s45, s46, s47, s48, s49, s50, s51, s52, s53, s9, s10, s11, s12, s13, s14, s15, s16, s17}
    case S45{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s8, s5, s2, s7, s4, s1, s6, s3, s0, s47, s46, s45, s50, s49, s48, s53, s52, s51, s38, s37, s36, s41, s40, s39, s44, s43, s42, s27, s30, s33, s28, s31, s34, s29, s32, s35, s20, s19, s18, s23, s22, s21, s26, s25, s24, s11, s10, s9, s14, s13, s12, s17, s16, s15}
    case S46{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s35, s32, s29, s34, s31, s28, s33, s30, s27, s24, s25, s26, s21, s22, s23, s18, s19, s20, s42, s43, s44, s39, s40, s41, s36, s37, s38, s0, s3, s6, s1, s4, s7, s2, s5, s8, s51, s52, s53, s48, s49, s50, s45, s46, s47, s15, s16, s17, s12, s13, s14, s9, s10, s11}
    case S47{} M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{s29, s32, s35, s28, s31, s34, s27, s30, s33, s53, s52, s51, s50, s49, s48, s47, s46, s45, s44, s43, s42, s41, s40, s39, s38, s37, s36, s6, s3, s0, s7, s4, s1, s8, s5, s2, s26, s25, s24, s23, s22, s21, s20, s19, s18, s17, s16, s15, s14, s13, s12, s11, s10, s9}

def paint(+sym: Symmetry, cube: M.Cube) -> M.Cube:
  match cube:
    case M.Cube{s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22, s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43, s44, s45, s46, s47, s48, s49, s50, s51, s52, s53}:
      M.Cube{color(sym, s0), color(sym, s1), color(sym, s2), color(sym, s3), color(sym, s4), color(sym, s5), color(sym, s6), color(sym, s7), color(sym, s8), color(sym, s9), color(sym, s10), color(sym, s11), color(sym, s12), color(sym, s13), color(sym, s14), color(sym, s15), color(sym, s16), color(sym, s17), color(sym, s18), color(sym, s19), color(sym, s20), color(sym, s21), color(sym, s22), color(sym, s23), color(sym, s24), color(sym, s25), color(sym, s26), color(sym, s27), color(sym, s28), color(sym, s29), color(sym, s30), color(sym, s31), color(sym, s32), color(sym, s33), color(sym, s34), color(sym, s35), color(sym, s36), color(sym, s37), color(sym, s38), color(sym, s39), color(sym, s40), color(sym, s41), color(sym, s42), color(sym, s43), color(sym, s44), color(sym, s45), color(sym, s46), color(sym, s47), color(sym, s48), color(sym, s49), color(sym, s50), color(sym, s51), color(sym, s52), color(sym, s53)}

def apply(+sym: Symmetry, cube: M.Cube) -> M.Cube:
  paint(sym, permute(sym, cube))

def map_move(sym: Symmetry, move: M.Move) -> M.Move:
  match sym move:
    case S0{} M.U{}:
      M.U{}
    case S0{} M.U2{}:
      M.U2{}
    case S0{} M.Ui{}:
      M.Ui{}
    case S0{} M.R{}:
      M.R{}
    case S0{} M.R2{}:
      M.R2{}
    case S0{} M.Ri{}:
      M.Ri{}
    case S0{} M.F{}:
      M.F{}
    case S0{} M.F2{}:
      M.F2{}
    case S0{} M.Fi{}:
      M.Fi{}
    case S0{} M.D{}:
      M.D{}
    case S0{} M.D2{}:
      M.D2{}
    case S0{} M.Di{}:
      M.Di{}
    case S0{} M.L{}:
      M.L{}
    case S0{} M.L2{}:
      M.L2{}
    case S0{} M.Li{}:
      M.Li{}
    case S0{} M.B{}:
      M.B{}
    case S0{} M.B2{}:
      M.B2{}
    case S0{} M.Bi{}:
      M.Bi{}
    case S1{} M.U{}:
      M.Ui{}
    case S1{} M.U2{}:
      M.U2{}
    case S1{} M.Ui{}:
      M.U{}
    case S1{} M.R{}:
      M.Li{}
    case S1{} M.R2{}:
      M.L2{}
    case S1{} M.Ri{}:
      M.L{}
    case S1{} M.F{}:
      M.Fi{}
    case S1{} M.F2{}:
      M.F2{}
    case S1{} M.Fi{}:
      M.F{}
    case S1{} M.D{}:
      M.Di{}
    case S1{} M.D2{}:
      M.D2{}
    case S1{} M.Di{}:
      M.D{}
    case S1{} M.L{}:
      M.Ri{}
    case S1{} M.L2{}:
      M.R2{}
    case S1{} M.Li{}:
      M.R{}
    case S1{} M.B{}:
      M.Bi{}
    case S1{} M.B2{}:
      M.B2{}
    case S1{} M.Bi{}:
      M.B{}
    case S2{} M.U{}:
      M.Di{}
    case S2{} M.U2{}:
      M.D2{}
    case S2{} M.Ui{}:
      M.D{}
    case S2{} M.R{}:
      M.Ri{}
    case S2{} M.R2{}:
      M.R2{}
    case S2{} M.Ri{}:
      M.R{}
    case S2{} M.F{}:
      M.Fi{}
    case S2{} M.F2{}:
      M.F2{}
    case S2{} M.Fi{}:
      M.F{}
    case S2{} M.D{}:
      M.Ui{}
    case S2{} M.D2{}:
      M.U2{}
    case S2{} M.Di{}:
      M.U{}
    case S2{} M.L{}:
      M.Li{}
    case S2{} M.L2{}:
      M.L2{}
    case S2{} M.Li{}:
      M.L{}
    case S2{} M.B{}:
      M.Bi{}
    case S2{} M.B2{}:
      M.B2{}
    case S2{} M.Bi{}:
      M.B{}
    case S3{} M.U{}:
      M.D{}
    case S3{} M.U2{}:
      M.D2{}
    case S3{} M.Ui{}:
      M.Di{}
    case S3{} M.R{}:
      M.L{}
    case S3{} M.R2{}:
      M.L2{}
    case S3{} M.Ri{}:
      M.Li{}
    case S3{} M.F{}:
      M.F{}
    case S3{} M.F2{}:
      M.F2{}
    case S3{} M.Fi{}:
      M.Fi{}
    case S3{} M.D{}:
      M.U{}
    case S3{} M.D2{}:
      M.U2{}
    case S3{} M.Di{}:
      M.Ui{}
    case S3{} M.L{}:
      M.R{}
    case S3{} M.L2{}:
      M.R2{}
    case S3{} M.Li{}:
      M.Ri{}
    case S3{} M.B{}:
      M.B{}
    case S3{} M.B2{}:
      M.B2{}
    case S3{} M.Bi{}:
      M.Bi{}
    case S4{} M.U{}:
      M.Ui{}
    case S4{} M.U2{}:
      M.U2{}
    case S4{} M.Ui{}:
      M.U{}
    case S4{} M.R{}:
      M.Ri{}
    case S4{} M.R2{}:
      M.R2{}
    case S4{} M.Ri{}:
      M.R{}
    case S4{} M.F{}:
      M.Bi{}
    case S4{} M.F2{}:
      M.B2{}
    case S4{} M.Fi{}:
      M.B{}
    case S4{} M.D{}:
      M.Di{}
    case S4{} M.D2{}:
      M.D2{}
    case S4{} M.Di{}:
      M.D{}
    case S4{} M.L{}:
      M.Li{}
    case S4{} M.L2{}:
      M.L2{}
    case S4{} M.Li{}:
      M.L{}
    case S4{} M.B{}:
      M.Fi{}
    case S4{} M.B2{}:
      M.F2{}
    case S4{} M.Bi{}:
      M.F{}
    case S5{} M.U{}:
      M.U{}
    case S5{} M.U2{}:
      M.U2{}
    case S5{} M.Ui{}:
      M.Ui{}
    case S5{} M.R{}:
      M.L{}
    case S5{} M.R2{}:
      M.L2{}
    case S5{} M.Ri{}:
      M.Li{}
    case S5{} M.F{}:
      M.B{}
    case S5{} M.F2{}:
      M.B2{}
    case S5{} M.Fi{}:
      M.Bi{}
    case S5{} M.D{}:
      M.D{}
    case S5{} M.D2{}:
      M.D2{}
    case S5{} M.Di{}:
      M.Di{}
    case S5{} M.L{}:
      M.R{}
    case S5{} M.L2{}:
      M.R2{}
    case S5{} M.Li{}:
      M.Ri{}
    case S5{} M.B{}:
      M.F{}
    case S5{} M.B2{}:
      M.F2{}
    case S5{} M.Bi{}:
      M.Fi{}
    case S6{} M.U{}:
      M.D{}
    case S6{} M.U2{}:
      M.D2{}
    case S6{} M.Ui{}:
      M.Di{}
    case S6{} M.R{}:
      M.R{}
    case S6{} M.R2{}:
      M.R2{}
    case S6{} M.Ri{}:
      M.Ri{}
    case S6{} M.F{}:
      M.B{}
    case S6{} M.F2{}:
      M.B2{}
    case S6{} M.Fi{}:
      M.Bi{}
    case S6{} M.D{}:
      M.U{}
    case S6{} M.D2{}:
      M.U2{}
    case S6{} M.Di{}:
      M.Ui{}
    case S6{} M.L{}:
      M.L{}
    case S6{} M.L2{}:
      M.L2{}
    case S6{} M.Li{}:
      M.Li{}
    case S6{} M.B{}:
      M.F{}
    case S6{} M.B2{}:
      M.F2{}
    case S6{} M.Bi{}:
      M.Fi{}
    case S7{} M.U{}:
      M.Di{}
    case S7{} M.U2{}:
      M.D2{}
    case S7{} M.Ui{}:
      M.D{}
    case S7{} M.R{}:
      M.Li{}
    case S7{} M.R2{}:
      M.L2{}
    case S7{} M.Ri{}:
      M.L{}
    case S7{} M.F{}:
      M.Bi{}
    case S7{} M.F2{}:
      M.B2{}
    case S7{} M.Fi{}:
      M.B{}
    case S7{} M.D{}:
      M.Ui{}
    case S7{} M.D2{}:
      M.U2{}
    case S7{} M.Di{}:
      M.U{}
    case S7{} M.L{}:
      M.Ri{}
    case S7{} M.L2{}:
      M.R2{}
    case S7{} M.Li{}:
      M.R{}
    case S7{} M.B{}:
      M.Fi{}
    case S7{} M.B2{}:
      M.F2{}
    case S7{} M.Bi{}:
      M.F{}
    case S8{} M.U{}:
      M.Fi{}
    case S8{} M.U2{}:
      M.F2{}
    case S8{} M.Ui{}:
      M.F{}
    case S8{} M.R{}:
      M.Ri{}
    case S8{} M.R2{}:
      M.R2{}
    case S8{} M.Ri{}:
      M.R{}
    case S8{} M.F{}:
      M.Ui{}
    case S8{} M.F2{}:
      M.U2{}
    case S8{} M.Fi{}:
      M.U{}
    case S8{} M.D{}:
      M.Bi{}
    case S8{} M.D2{}:
      M.B2{}
    case S8{} M.Di{}:
      M.B{}
    case S8{} M.L{}:
      M.Li{}
    case S8{} M.L2{}:
      M.L2{}
    case S8{} M.Li{}:
      M.L{}
    case S8{} M.B{}:
      M.Di{}
    case S8{} M.B2{}:
      M.D2{}
    case S8{} M.Bi{}:
      M.D{}
    case S9{} M.U{}:
      M.F{}
    case S9{} M.U2{}:
      M.F2{}
    case S9{} M.Ui{}:
      M.Fi{}
    case S9{} M.R{}:
      M.L{}
    case S9{} M.R2{}:
      M.L2{}
    case S9{} M.Ri{}:
      M.Li{}
    case S9{} M.F{}:
      M.U{}
    case S9{} M.F2{}:
      M.U2{}
    case S9{} M.Fi{}:
      M.Ui{}
    case S9{} M.D{}:
      M.B{}
    case S9{} M.D2{}:
      M.B2{}
    case S9{} M.Di{}:
      M.Bi{}
    case S9{} M.L{}:
      M.R{}
    case S9{} M.L2{}:
      M.R2{}
    case S9{} M.Li{}:
      M.Ri{}
    case S9{} M.B{}:
      M.D{}
    case S9{} M.B2{}:
      M.D2{}
    case S9{} M.Bi{}:
      M.Di{}
    case S10{} M.U{}:
      M.F{}
    case S10{} M.U2{}:
      M.F2{}
    case S10{} M.Ui{}:
      M.Fi{}
    case S10{} M.R{}:
      M.R{}
    case S10{} M.R2{}:
      M.R2{}
    case S10{} M.Ri{}:
      M.Ri{}
    case S10{} M.F{}:
      M.D{}
    case S10{} M.F2{}:
      M.D2{}
    case S10{} M.Fi{}:
      M.Di{}
    case S10{} M.D{}:
      M.B{}
    case S10{} M.D2{}:
      M.B2{}
    case S10{} M.Di{}:
      M.Bi{}
    case S10{} M.L{}:
      M.L{}
    case S10{} M.L2{}:
      M.L2{}
    case S10{} M.Li{}:
      M.Li{}
    case S10{} M.B{}:
      M.U{}
    case S10{} M.B2{}:
      M.U2{}
    case S10{} M.Bi{}:
      M.Ui{}
    case S11{} M.U{}:
      M.Fi{}
    case S11{} M.U2{}:
      M.F2{}
    case S11{} M.Ui{}:
      M.F{}
    case S11{} M.R{}:
      M.Li{}
    case S11{} M.R2{}:
      M.L2{}
    case S11{} M.Ri{}:
      M.L{}
    case S11{} M.F{}:
      M.Di{}
    case S11{} M.F2{}:
      M.D2{}
    case S11{} M.Fi{}:
      M.D{}
    case S11{} M.D{}:
      M.Bi{}
    case S11{} M.D2{}:
      M.B2{}
    case S11{} M.Di{}:
      M.B{}
    case S11{} M.L{}:
      M.Ri{}
    case S11{} M.L2{}:
      M.R2{}
    case S11{} M.Li{}:
      M.R{}
    case S11{} M.B{}:
      M.Ui{}
    case S11{} M.B2{}:
      M.U2{}
    case S11{} M.Bi{}:
      M.U{}
    case S12{} M.U{}:
      M.B{}
    case S12{} M.U2{}:
      M.B2{}
    case S12{} M.Ui{}:
      M.Bi{}
    case S12{} M.R{}:
      M.R{}
    case S12{} M.R2{}:
      M.R2{}
    case S12{} M.Ri{}:
      M.Ri{}
    case S12{} M.F{}:
      M.U{}
    case S12{} M.F2{}:
      M.U2{}
    case S12{} M.Fi{}:
      M.Ui{}
    case S12{} M.D{}:
      M.F{}
    case S12{} M.D2{}:
      M.F2{}
    case S12{} M.Di{}:
      M.Fi{}
    case S12{} M.L{}:
      M.L{}
    case S12{} M.L2{}:
      M.L2{}
    case S12{} M.Li{}:
      M.Li{}
    case S12{} M.B{}:
      M.D{}
    case S12{} M.B2{}:
      M.D2{}
    case S12{} M.Bi{}:
      M.Di{}
    case S13{} M.U{}:
      M.Bi{}
    case S13{} M.U2{}:
      M.B2{}
    case S13{} M.Ui{}:
      M.B{}
    case S13{} M.R{}:
      M.Li{}
    case S13{} M.R2{}:
      M.L2{}
    case S13{} M.Ri{}:
      M.L{}
    case S13{} M.F{}:
      M.Ui{}
    case S13{} M.F2{}:
      M.U2{}
    case S13{} M.Fi{}:
      M.U{}
    case S13{} M.D{}:
      M.Fi{}
    case S13{} M.D2{}:
      M.F2{}
    case S13{} M.Di{}:
      M.F{}
    case S13{} M.L{}:
      M.Ri{}
    case S13{} M.L2{}:
      M.R2{}
    case S13{} M.Li{}:
      M.R{}
    case S13{} M.B{}:
      M.Di{}
    case S13{} M.B2{}:
      M.D2{}
    case S13{} M.Bi{}:
      M.D{}
    case S14{} M.U{}:
      M.Bi{}
    case S14{} M.U2{}:
      M.B2{}
    case S14{} M.Ui{}:
      M.B{}
    case S14{} M.R{}:
      M.Ri{}
    case S14{} M.R2{}:
      M.R2{}
    case S14{} M.Ri{}:
      M.R{}
    case S14{} M.F{}:
      M.Di{}
    case S14{} M.F2{}:
      M.D2{}
    case S14{} M.Fi{}:
      M.D{}
    case S14{} M.D{}:
      M.Fi{}
    case S14{} M.D2{}:
      M.F2{}
    case S14{} M.Di{}:
      M.F{}
    case S14{} M.L{}:
      M.Li{}
    case S14{} M.L2{}:
      M.L2{}
    case S14{} M.Li{}:
      M.L{}
    case S14{} M.B{}:
      M.Ui{}
    case S14{} M.B2{}:
      M.U2{}
    case S14{} M.Bi{}:
      M.U{}
    case S15{} M.U{}:
      M.B{}
    case S15{} M.U2{}:
      M.B2{}
    case S15{} M.Ui{}:
      M.Bi{}
    case S15{} M.R{}:
      M.L{}
    case S15{} M.R2{}:
      M.L2{}
    case S15{} M.Ri{}:
      M.Li{}
    case S15{} M.F{}:
      M.D{}
    case S15{} M.F2{}:
      M.D2{}
    case S15{} M.Fi{}:
      M.Di{}
    case S15{} M.D{}:
      M.F{}
    case S15{} M.D2{}:
      M.F2{}
    case S15{} M.Di{}:
      M.Fi{}
    case S15{} M.L{}:
      M.R{}
    case S15{} M.L2{}:
      M.R2{}
    case S15{} M.Li{}:
      M.Ri{}
    case S15{} M.B{}:
      M.U{}
    case S15{} M.B2{}:
      M.U2{}
    case S15{} M.Bi{}:
      M.Ui{}
    case S16{} M.U{}:
      M.Ri{}
    case S16{} M.U2{}:
      M.R2{}
    case S16{} M.Ui{}:
      M.R{}
    case S16{} M.R{}:
      M.Ui{}
    case S16{} M.R2{}:
      M.U2{}
    case S16{} M.Ri{}:
      M.U{}
    case S16{} M.F{}:
      M.Fi{}
    case S16{} M.F2{}:
      M.F2{}
    case S16{} M.Fi{}:
      M.F{}
    case S16{} M.D{}:
      M.Li{}
    case S16{} M.D2{}:
      M.L2{}
    case S16{} M.Di{}:
      M.L{}
    case S16{} M.L{}:
      M.Di{}
    case S16{} M.L2{}:
      M.D2{}
    case S16{} M.Li{}:
      M.D{}
    case S16{} M.B{}:
      M.Bi{}
    case S16{} M.B2{}:
      M.B2{}
    case S16{} M.Bi{}:
      M.B{}
    case S17{} M.U{}:
      M.L{}
    case S17{} M.U2{}:
      M.L2{}
    case S17{} M.Ui{}:
      M.Li{}
    case S17{} M.R{}:
      M.U{}
    case S17{} M.R2{}:
      M.U2{}
    case S17{} M.Ri{}:
      M.Ui{}
    case S17{} M.F{}:
      M.F{}
    case S17{} M.F2{}:
      M.F2{}
    case S17{} M.Fi{}:
      M.Fi{}
    case S17{} M.D{}:
      M.R{}
    case S17{} M.D2{}:
      M.R2{}
    case S17{} M.Di{}:
      M.Ri{}
    case S17{} M.L{}:
      M.D{}
    case S17{} M.L2{}:
      M.D2{}
    case S17{} M.Li{}:
      M.Di{}
    case S17{} M.B{}:
      M.B{}
    case S17{} M.B2{}:
      M.B2{}
    case S17{} M.Bi{}:
      M.Bi{}
    case S18{} M.U{}:
      M.R{}
    case S18{} M.U2{}:
      M.R2{}
    case S18{} M.Ui{}:
      M.Ri{}
    case S18{} M.R{}:
      M.D{}
    case S18{} M.R2{}:
      M.D2{}
    case S18{} M.Ri{}:
      M.Di{}
    case S18{} M.F{}:
      M.F{}
    case S18{} M.F2{}:
      M.F2{}
    case S18{} M.Fi{}:
      M.Fi{}
    case S18{} M.D{}:
      M.L{}
    case S18{} M.D2{}:
      M.L2{}
    case S18{} M.Di{}:
      M.Li{}
    case S18{} M.L{}:
      M.U{}
    case S18{} M.L2{}:
      M.U2{}
    case S18{} M.Li{}:
      M.Ui{}
    case S18{} M.B{}:
      M.B{}
    case S18{} M.B2{}:
      M.B2{}
    case S18{} M.Bi{}:
      M.Bi{}
    case S19{} M.U{}:
      M.Li{}
    case S19{} M.U2{}:
      M.L2{}
    case S19{} M.Ui{}:
      M.L{}
    case S19{} M.R{}:
      M.Di{}
    case S19{} M.R2{}:
      M.D2{}
    case S19{} M.Ri{}:
      M.D{}
    case S19{} M.F{}:
      M.Fi{}
    case S19{} M.F2{}:
      M.F2{}
    case S19{} M.Fi{}:
      M.F{}
    case S19{} M.D{}:
      M.Ri{}
    case S19{} M.D2{}:
      M.R2{}
    case S19{} M.Di{}:
      M.R{}
    case S19{} M.L{}:
      M.Ui{}
    case S19{} M.L2{}:
      M.U2{}
    case S19{} M.Li{}:
      M.U{}
    case S19{} M.B{}:
      M.Bi{}
    case S19{} M.B2{}:
      M.B2{}
    case S19{} M.Bi{}:
      M.B{}
    case S20{} M.U{}:
      M.R{}
    case S20{} M.U2{}:
      M.R2{}
    case S20{} M.Ui{}:
      M.Ri{}
    case S20{} M.R{}:
      M.U{}
    case S20{} M.R2{}:
      M.U2{}
    case S20{} M.Ri{}:
      M.Ui{}
    case S20{} M.F{}:
      M.B{}
    case S20{} M.F2{}:
      M.B2{}
    case S20{} M.Fi{}:
      M.Bi{}
    case S20{} M.D{}:
      M.L{}
    case S20{} M.D2{}:
      M.L2{}
    case S20{} M.Di{}:
      M.Li{}
    case S20{} M.L{}:
      M.D{}
    case S20{} M.L2{}:
      M.D2{}
    case S20{} M.Li{}:
      M.Di{}
    case S20{} M.B{}:
      M.F{}
    case S20{} M.B2{}:
      M.F2{}
    case S20{} M.Bi{}:
      M.Fi{}
    case S21{} M.U{}:
      M.Li{}
    case S21{} M.U2{}:
      M.L2{}
    case S21{} M.Ui{}:
      M.L{}
    case S21{} M.R{}:
      M.Ui{}
    case S21{} M.R2{}:
      M.U2{}
    case S21{} M.Ri{}:
      M.U{}
    case S21{} M.F{}:
      M.Bi{}
    case S21{} M.F2{}:
      M.B2{}
    case S21{} M.Fi{}:
      M.B{}
    case S21{} M.D{}:
      M.Ri{}
    case S21{} M.D2{}:
      M.R2{}
    case S21{} M.Di{}:
      M.R{}
    case S21{} M.L{}:
      M.Di{}
    case S21{} M.L2{}:
      M.D2{}
    case S21{} M.Li{}:
      M.D{}
    case S21{} M.B{}:
      M.Fi{}
    case S21{} M.B2{}:
      M.F2{}
    case S21{} M.Bi{}:
      M.F{}
    case S22{} M.U{}:
      M.Ri{}
    case S22{} M.U2{}:
      M.R2{}
    case S22{} M.Ui{}:
      M.R{}
    case S22{} M.R{}:
      M.Di{}
    case S22{} M.R2{}:
      M.D2{}
    case S22{} M.Ri{}:
      M.D{}
    case S22{} M.F{}:
      M.Bi{}
    case S22{} M.F2{}:
      M.B2{}
    case S22{} M.Fi{}:
      M.B{}
    case S22{} M.D{}:
      M.Li{}
    case S22{} M.D2{}:
      M.L2{}
    case S22{} M.Di{}:
      M.L{}
    case S22{} M.L{}:
      M.Ui{}
    case S22{} M.L2{}:
      M.U2{}
    case S22{} M.Li{}:
      M.U{}
    case S22{} M.B{}:
      M.Fi{}
    case S22{} M.B2{}:
      M.F2{}
    case S22{} M.Bi{}:
      M.F{}
    case S23{} M.U{}:
      M.L{}
    case S23{} M.U2{}:
      M.L2{}
    case S23{} M.Ui{}:
      M.Li{}
    case S23{} M.R{}:
      M.D{}
    case S23{} M.R2{}:
      M.D2{}
    case S23{} M.Ri{}:
      M.Di{}
    case S23{} M.F{}:
      M.B{}
    case S23{} M.F2{}:
      M.B2{}
    case S23{} M.Fi{}:
      M.Bi{}
    case S23{} M.D{}:
      M.R{}
    case S23{} M.D2{}:
      M.R2{}
    case S23{} M.Di{}:
      M.Ri{}
    case S23{} M.L{}:
      M.U{}
    case S23{} M.L2{}:
      M.U2{}
    case S23{} M.Li{}:
      M.Ui{}
    case S23{} M.B{}:
      M.F{}
    case S23{} M.B2{}:
      M.F2{}
    case S23{} M.Bi{}:
      M.Fi{}
    case S24{} M.U{}:
      M.R{}
    case S24{} M.U2{}:
      M.R2{}
    case S24{} M.Ui{}:
      M.Ri{}
    case S24{} M.R{}:
      M.F{}
    case S24{} M.R2{}:
      M.F2{}
    case S24{} M.Ri{}:
      M.Fi{}
    case S24{} M.F{}:
      M.U{}
    case S24{} M.F2{}:
      M.U2{}
    case S24{} M.Fi{}:
      M.Ui{}
    case S24{} M.D{}:
      M.L{}
    case S24{} M.D2{}:
      M.L2{}
    case S24{} M.Di{}:
      M.Li{}
    case S24{} M.L{}:
      M.B{}
    case S24{} M.L2{}:
      M.B2{}
    case S24{} M.Li{}:
      M.Bi{}
    case S24{} M.B{}:
      M.D{}
    case S24{} M.B2{}:
      M.D2{}
    case S24{} M.Bi{}:
      M.Di{}
    case S25{} M.U{}:
      M.Li{}
    case S25{} M.U2{}:
      M.L2{}
    case S25{} M.Ui{}:
      M.L{}
    case S25{} M.R{}:
      M.Fi{}
    case S25{} M.R2{}:
      M.F2{}
    case S25{} M.Ri{}:
      M.F{}
    case S25{} M.F{}:
      M.Ui{}
    case S25{} M.F2{}:
      M.U2{}
    case S25{} M.Fi{}:
      M.U{}
    case S25{} M.D{}:
      M.Ri{}
    case S25{} M.D2{}:
      M.R2{}
    case S25{} M.Di{}:
      M.R{}
    case S25{} M.L{}:
      M.Bi{}
    case S25{} M.L2{}:
      M.B2{}
    case S25{} M.Li{}:
      M.B{}
    case S25{} M.B{}:
      M.Di{}
    case S25{} M.B2{}:
      M.D2{}
    case S25{} M.Bi{}:
      M.D{}
    case S26{} M.U{}:
      M.Ri{}
    case S26{} M.U2{}:
      M.R2{}
    case S26{} M.Ui{}:
      M.R{}
    case S26{} M.R{}:
      M.Fi{}
    case S26{} M.R2{}:
      M.F2{}
    case S26{} M.Ri{}:
      M.F{}
    case S26{} M.F{}:
      M.Di{}
    case S26{} M.F2{}:
      M.D2{}
    case S26{} M.Fi{}:
      M.D{}
    case S26{} M.D{}:
      M.Li{}
    case S26{} M.D2{}:
      M.L2{}
    case S26{} M.Di{}:
      M.L{}
    case S26{} M.L{}:
      M.Bi{}
    case S26{} M.L2{}:
      M.B2{}
    case S26{} M.Li{}:
      M.B{}
    case S26{} M.B{}:
      M.Ui{}
    case S26{} M.B2{}:
      M.U2{}
    case S26{} M.Bi{}:
      M.U{}
    case S27{} M.U{}:
      M.L{}
    case S27{} M.U2{}:
      M.L2{}
    case S27{} M.Ui{}:
      M.Li{}
    case S27{} M.R{}:
      M.F{}
    case S27{} M.R2{}:
      M.F2{}
    case S27{} M.Ri{}:
      M.Fi{}
    case S27{} M.F{}:
      M.D{}
    case S27{} M.F2{}:
      M.D2{}
    case S27{} M.Fi{}:
      M.Di{}
    case S27{} M.D{}:
      M.R{}
    case S27{} M.D2{}:
      M.R2{}
    case S27{} M.Di{}:
      M.Ri{}
    case S27{} M.L{}:
      M.B{}
    case S27{} M.L2{}:
      M.B2{}
    case S27{} M.Li{}:
      M.Bi{}
    case S27{} M.B{}:
      M.U{}
    case S27{} M.B2{}:
      M.U2{}
    case S27{} M.Bi{}:
      M.Ui{}
    case S28{} M.U{}:
      M.Ri{}
    case S28{} M.U2{}:
      M.R2{}
    case S28{} M.Ui{}:
      M.R{}
    case S28{} M.R{}:
      M.Bi{}
    case S28{} M.R2{}:
      M.B2{}
    case S28{} M.Ri{}:
      M.B{}
    case S28{} M.F{}:
      M.Ui{}
    case S28{} M.F2{}:
      M.U2{}
    case S28{} M.Fi{}:
      M.U{}
    case S28{} M.D{}:
      M.Li{}
    case S28{} M.D2{}:
      M.L2{}
    case S28{} M.Di{}:
      M.L{}
    case S28{} M.L{}:
      M.Fi{}
    case S28{} M.L2{}:
      M.F2{}
    case S28{} M.Li{}:
      M.F{}
    case S28{} M.B{}:
      M.Di{}
    case S28{} M.B2{}:
      M.D2{}
    case S28{} M.Bi{}:
      M.D{}
    case S29{} M.U{}:
      M.L{}
    case S29{} M.U2{}:
      M.L2{}
    case S29{} M.Ui{}:
      M.Li{}
    case S29{} M.R{}:
      M.B{}
    case S29{} M.R2{}:
      M.B2{}
    case S29{} M.Ri{}:
      M.Bi{}
    case S29{} M.F{}:
      M.U{}
    case S29{} M.F2{}:
      M.U2{}
    case S29{} M.Fi{}:
      M.Ui{}
    case S29{} M.D{}:
      M.R{}
    case S29{} M.D2{}:
      M.R2{}
    case S29{} M.Di{}:
      M.Ri{}
    case S29{} M.L{}:
      M.F{}
    case S29{} M.L2{}:
      M.F2{}
    case S29{} M.Li{}:
      M.Fi{}
    case S29{} M.B{}:
      M.D{}
    case S29{} M.B2{}:
      M.D2{}
    case S29{} M.Bi{}:
      M.Di{}
    case S30{} M.U{}:
      M.R{}
    case S30{} M.U2{}:
      M.R2{}
    case S30{} M.Ui{}:
      M.Ri{}
    case S30{} M.R{}:
      M.B{}
    case S30{} M.R2{}:
      M.B2{}
    case S30{} M.Ri{}:
      M.Bi{}
    case S30{} M.F{}:
      M.D{}
    case S30{} M.F2{}:
      M.D2{}
    case S30{} M.Fi{}:
      M.Di{}
    case S30{} M.D{}:
      M.L{}
    case S30{} M.D2{}:
      M.L2{}
    case S30{} M.Di{}:
      M.Li{}
    case S30{} M.L{}:
      M.F{}
    case S30{} M.L2{}:
      M.F2{}
    case S30{} M.Li{}:
      M.Fi{}
    case S30{} M.B{}:
      M.U{}
    case S30{} M.B2{}:
      M.U2{}
    case S30{} M.Bi{}:
      M.Ui{}
    case S31{} M.U{}:
      M.Li{}
    case S31{} M.U2{}:
      M.L2{}
    case S31{} M.Ui{}:
      M.L{}
    case S31{} M.R{}:
      M.Bi{}
    case S31{} M.R2{}:
      M.B2{}
    case S31{} M.Ri{}:
      M.B{}
    case S31{} M.F{}:
      M.Di{}
    case S31{} M.F2{}:
      M.D2{}
    case S31{} M.Fi{}:
      M.D{}
    case S31{} M.D{}:
      M.Ri{}
    case S31{} M.D2{}:
      M.R2{}
    case S31{} M.Di{}:
      M.R{}
    case S31{} M.L{}:
      M.Fi{}
    case S31{} M.L2{}:
      M.F2{}
    case S31{} M.Li{}:
      M.F{}
    case S31{} M.B{}:
      M.Ui{}
    case S31{} M.B2{}:
      M.U2{}
    case S31{} M.Bi{}:
      M.U{}
    case S32{} M.U{}:
      M.F{}
    case S32{} M.U2{}:
      M.F2{}
    case S32{} M.Ui{}:
      M.Fi{}
    case S32{} M.R{}:
      M.U{}
    case S32{} M.R2{}:
      M.U2{}
    case S32{} M.Ri{}:
      M.Ui{}
    case S32{} M.F{}:
      M.R{}
    case S32{} M.F2{}:
      M.R2{}
    case S32{} M.Fi{}:
      M.Ri{}
    case S32{} M.D{}:
      M.B{}
    case S32{} M.D2{}:
      M.B2{}
    case S32{} M.Di{}:
      M.Bi{}
    case S32{} M.L{}:
      M.D{}
    case S32{} M.L2{}:
      M.D2{}
    case S32{} M.Li{}:
      M.Di{}
    case S32{} M.B{}:
      M.L{}
    case S32{} M.B2{}:
      M.L2{}
    case S32{} M.Bi{}:
      M.Li{}
    case S33{} M.U{}:
      M.Fi{}
    case S33{} M.U2{}:
      M.F2{}
    case S33{} M.Ui{}:
      M.F{}
    case S33{} M.R{}:
      M.Ui{}
    case S33{} M.R2{}:
      M.U2{}
    case S33{} M.Ri{}:
      M.U{}
    case S33{} M.F{}:
      M.Li{}
    case S33{} M.F2{}:
      M.L2{}
    case S33{} M.Fi{}:
      M.L{}
    case S33{} M.D{}:
      M.Bi{}
    case S33{} M.D2{}:
      M.B2{}
    case S33{} M.Di{}:
      M.B{}
    case S33{} M.L{}:
      M.Di{}
    case S33{} M.L2{}:
      M.D2{}
    case S33{} M.Li{}:
      M.D{}
    case S33{} M.B{}:
      M.Ri{}
    case S33{} M.B2{}:
      M.R2{}
    case S33{} M.Bi{}:
      M.R{}
    case S34{} M.U{}:
      M.Fi{}
    case S34{} M.U2{}:
      M.F2{}
    case S34{} M.Ui{}:
      M.F{}
    case S34{} M.R{}:
      M.Di{}
    case S34{} M.R2{}:
      M.D2{}
    case S34{} M.Ri{}:
      M.D{}
    case S34{} M.F{}:
      M.Ri{}
    case S34{} M.F2{}:
      M.R2{}
    case S34{} M.Fi{}:
      M.R{}
    case S34{} M.D{}:
      M.Bi{}
    case S34{} M.D2{}:
      M.B2{}
    case S34{} M.Di{}:
      M.B{}
    case S34{} M.L{}:
      M.Ui{}
    case S34{} M.L2{}:
      M.U2{}
    case S34{} M.Li{}:
      M.U{}
    case S34{} M.B{}:
      M.Li{}
    case S34{} M.B2{}:
      M.L2{}
    case S34{} M.Bi{}:
      M.L{}
    case S35{} M.U{}:
      M.F{}
    case S35{} M.U2{}:
      M.F2{}
    case S35{} M.Ui{}:
      M.Fi{}
    case S35{} M.R{}:
      M.D{}
    case S35{} M.R2{}:
      M.D2{}
    case S35{} M.Ri{}:
      M.Di{}
    case S35{} M.F{}:
      M.L{}
    case S35{} M.F2{}:
      M.L2{}
    case S35{} M.Fi{}:
      M.Li{}
    case S35{} M.D{}:
      M.B{}
    case S35{} M.D2{}:
      M.B2{}
    case S35{} M.Di{}:
      M.Bi{}
    case S35{} M.L{}:
      M.U{}
    case S35{} M.L2{}:
      M.U2{}
    case S35{} M.Li{}:
      M.Ui{}
    case S35{} M.B{}:
      M.R{}
    case S35{} M.B2{}:
      M.R2{}
    case S35{} M.Bi{}:
      M.Ri{}
    case S36{} M.U{}:
      M.Bi{}
    case S36{} M.U2{}:
      M.B2{}
    case S36{} M.Ui{}:
      M.B{}
    case S36{} M.R{}:
      M.Ui{}
    case S36{} M.R2{}:
      M.U2{}
    case S36{} M.Ri{}:
      M.U{}
    case S36{} M.F{}:
      M.Ri{}
    case S36{} M.F2{}:
      M.R2{}
    case S36{} M.Fi{}:
      M.R{}
    case S36{} M.D{}:
      M.Fi{}
    case S36{} M.D2{}:
      M.F2{}
    case S36{} M.Di{}:
      M.F{}
    case S36{} M.L{}:
      M.Di{}
    case S36{} M.L2{}:
      M.D2{}
    case S36{} M.Li{}:
      M.D{}
    case S36{} M.B{}:
      M.Li{}
    case S36{} M.B2{}:
      M.L2{}
    case S36{} M.Bi{}:
      M.L{}
    case S37{} M.U{}:
      M.B{}
    case S37{} M.U2{}:
      M.B2{}
    case S37{} M.Ui{}:
      M.Bi{}
    case S37{} M.R{}:
      M.U{}
    case S37{} M.R2{}:
      M.U2{}
    case S37{} M.Ri{}:
      M.Ui{}
    case S37{} M.F{}:
      M.L{}
    case S37{} M.F2{}:
      M.L2{}
    case S37{} M.Fi{}:
      M.Li{}
    case S37{} M.D{}:
      M.F{}
    case S37{} M.D2{}:
      M.F2{}
    case S37{} M.Di{}:
      M.Fi{}
    case S37{} M.L{}:
      M.D{}
    case S37{} M.L2{}:
      M.D2{}
    case S37{} M.Li{}:
      M.Di{}
    case S37{} M.B{}:
      M.R{}
    case S37{} M.B2{}:
      M.R2{}
    case S37{} M.Bi{}:
      M.Ri{}
    case S38{} M.U{}:
      M.B{}
    case S38{} M.U2{}:
      M.B2{}
    case S38{} M.Ui{}:
      M.Bi{}
    case S38{} M.R{}:
      M.D{}
    case S38{} M.R2{}:
      M.D2{}
    case S38{} M.Ri{}:
      M.Di{}
    case S38{} M.F{}:
      M.R{}
    case S38{} M.F2{}:
      M.R2{}
    case S38{} M.Fi{}:
      M.Ri{}
    case S38{} M.D{}:
      M.F{}
    case S38{} M.D2{}:
      M.F2{}
    case S38{} M.Di{}:
      M.Fi{}
    case S38{} M.L{}:
      M.U{}
    case S38{} M.L2{}:
      M.U2{}
    case S38{} M.Li{}:
      M.Ui{}
    case S38{} M.B{}:
      M.L{}
    case S38{} M.B2{}:
      M.L2{}
    case S38{} M.Bi{}:
      M.Li{}
    case S39{} M.U{}:
      M.Bi{}
    case S39{} M.U2{}:
      M.B2{}
    case S39{} M.Ui{}:
      M.B{}
    case S39{} M.R{}:
      M.Di{}
    case S39{} M.R2{}:
      M.D2{}
    case S39{} M.Ri{}:
      M.D{}
    case S39{} M.F{}:
      M.Li{}
    case S39{} M.F2{}:
      M.L2{}
    case S39{} M.Fi{}:
      M.L{}
    case S39{} M.D{}:
      M.Fi{}
    case S39{} M.D2{}:
      M.F2{}
    case S39{} M.Di{}:
      M.F{}
    case S39{} M.L{}:
      M.Ui{}
    case S39{} M.L2{}:
      M.U2{}
    case S39{} M.Li{}:
      M.U{}
    case S39{} M.B{}:
      M.Ri{}
    case S39{} M.B2{}:
      M.R2{}
    case S39{} M.Bi{}:
      M.R{}
    case S40{} M.U{}:
      M.Ui{}
    case S40{} M.U2{}:
      M.U2{}
    case S40{} M.Ui{}:
      M.U{}
    case S40{} M.R{}:
      M.Fi{}
    case S40{} M.R2{}:
      M.F2{}
    case S40{} M.Ri{}:
      M.F{}
    case S40{} M.F{}:
      M.Ri{}
    case S40{} M.F2{}:
      M.R2{}
    case S40{} M.Fi{}:
      M.R{}
    case S40{} M.D{}:
      M.Di{}
    case S40{} M.D2{}:
      M.D2{}
    case S40{} M.Di{}:
      M.D{}
    case S40{} M.L{}:
      M.Bi{}
    case S40{} M.L2{}:
      M.B2{}
    case S40{} M.Li{}:
      M.B{}
    case S40{} M.B{}:
      M.Li{}
    case S40{} M.B2{}:
      M.L2{}
    case S40{} M.Bi{}:
      M.L{}
    case S41{} M.U{}:
      M.U{}
    case S41{} M.U2{}:
      M.U2{}
    case S41{} M.Ui{}:
      M.Ui{}
    case S41{} M.R{}:
      M.F{}
    case S41{} M.R2{}:
      M.F2{}
    case S41{} M.Ri{}:
      M.Fi{}
    case S41{} M.F{}:
      M.L{}
    case S41{} M.F2{}:
      M.L2{}
    case S41{} M.Fi{}:
      M.Li{}
    case S41{} M.D{}:
      M.D{}
    case S41{} M.D2{}:
      M.D2{}
    case S41{} M.Di{}:
      M.Di{}
    case S41{} M.L{}:
      M.B{}
    case S41{} M.L2{}:
      M.B2{}
    case S41{} M.Li{}:
      M.Bi{}
    case S41{} M.B{}:
      M.R{}
    case S41{} M.B2{}:
      M.R2{}
    case S41{} M.Bi{}:
      M.Ri{}
    case S42{} M.U{}:
      M.D{}
    case S42{} M.U2{}:
      M.D2{}
    case S42{} M.Ui{}:
      M.Di{}
    case S42{} M.R{}:
      M.F{}
    case S42{} M.R2{}:
      M.F2{}
    case S42{} M.Ri{}:
      M.Fi{}
    case S42{} M.F{}:
      M.R{}
    case S42{} M.F2{}:
      M.R2{}
    case S42{} M.Fi{}:
      M.Ri{}
    case S42{} M.D{}:
      M.U{}
    case S42{} M.D2{}:
      M.U2{}
    case S42{} M.Di{}:
      M.Ui{}
    case S42{} M.L{}:
      M.B{}
    case S42{} M.L2{}:
      M.B2{}
    case S42{} M.Li{}:
      M.Bi{}
    case S42{} M.B{}:
      M.L{}
    case S42{} M.B2{}:
      M.L2{}
    case S42{} M.Bi{}:
      M.Li{}
    case S43{} M.U{}:
      M.Di{}
    case S43{} M.U2{}:
      M.D2{}
    case S43{} M.Ui{}:
      M.D{}
    case S43{} M.R{}:
      M.Fi{}
    case S43{} M.R2{}:
      M.F2{}
    case S43{} M.Ri{}:
      M.F{}
    case S43{} M.F{}:
      M.Li{}
    case S43{} M.F2{}:
      M.L2{}
    case S43{} M.Fi{}:
      M.L{}
    case S43{} M.D{}:
      M.Ui{}
    case S43{} M.D2{}:
      M.U2{}
    case S43{} M.Di{}:
      M.U{}
    case S43{} M.L{}:
      M.Bi{}
    case S43{} M.L2{}:
      M.B2{}
    case S43{} M.Li{}:
      M.B{}
    case S43{} M.B{}:
      M.Ri{}
    case S43{} M.B2{}:
      M.R2{}
    case S43{} M.Bi{}:
      M.R{}
    case S44{} M.U{}:
      M.U{}
    case S44{} M.U2{}:
      M.U2{}
    case S44{} M.Ui{}:
      M.Ui{}
    case S44{} M.R{}:
      M.B{}
    case S44{} M.R2{}:
      M.B2{}
    case S44{} M.Ri{}:
      M.Bi{}
    case S44{} M.F{}:
      M.R{}
    case S44{} M.F2{}:
      M.R2{}
    case S44{} M.Fi{}:
      M.Ri{}
    case S44{} M.D{}:
      M.D{}
    case S44{} M.D2{}:
      M.D2{}
    case S44{} M.Di{}:
      M.Di{}
    case S44{} M.L{}:
      M.F{}
    case S44{} M.L2{}:
      M.F2{}
    case S44{} M.Li{}:
      M.Fi{}
    case S44{} M.B{}:
      M.L{}
    case S44{} M.B2{}:
      M.L2{}
    case S44{} M.Bi{}:
      M.Li{}
    case S45{} M.U{}:
      M.Ui{}
    case S45{} M.U2{}:
      M.U2{}
    case S45{} M.Ui{}:
      M.U{}
    case S45{} M.R{}:
      M.Bi{}
    case S45{} M.R2{}:
      M.B2{}
    case S45{} M.Ri{}:
      M.B{}
    case S45{} M.F{}:
      M.Li{}
    case S45{} M.F2{}:
      M.L2{}
    case S45{} M.Fi{}:
      M.L{}
    case S45{} M.D{}:
      M.Di{}
    case S45{} M.D2{}:
      M.D2{}
    case S45{} M.Di{}:
      M.D{}
    case S45{} M.L{}:
      M.Fi{}
    case S45{} M.L2{}:
      M.F2{}
    case S45{} M.Li{}:
      M.F{}
    case S45{} M.B{}:
      M.Ri{}
    case S45{} M.B2{}:
      M.R2{}
    case S45{} M.Bi{}:
      M.R{}
    case S46{} M.U{}:
      M.Di{}
    case S46{} M.U2{}:
      M.D2{}
    case S46{} M.Ui{}:
      M.D{}
    case S46{} M.R{}:
      M.Bi{}
    case S46{} M.R2{}:
      M.B2{}
    case S46{} M.Ri{}:
      M.B{}
    case S46{} M.F{}:
      M.Ri{}
    case S46{} M.F2{}:
      M.R2{}
    case S46{} M.Fi{}:
      M.R{}
    case S46{} M.D{}:
      M.Ui{}
    case S46{} M.D2{}:
      M.U2{}
    case S46{} M.Di{}:
      M.U{}
    case S46{} M.L{}:
      M.Fi{}
    case S46{} M.L2{}:
      M.F2{}
    case S46{} M.Li{}:
      M.F{}
    case S46{} M.B{}:
      M.Li{}
    case S46{} M.B2{}:
      M.L2{}
    case S46{} M.Bi{}:
      M.L{}
    case S47{} M.U{}:
      M.D{}
    case S47{} M.U2{}:
      M.D2{}
    case S47{} M.Ui{}:
      M.Di{}
    case S47{} M.R{}:
      M.B{}
    case S47{} M.R2{}:
      M.B2{}
    case S47{} M.Ri{}:
      M.Bi{}
    case S47{} M.F{}:
      M.L{}
    case S47{} M.F2{}:
      M.L2{}
    case S47{} M.Fi{}:
      M.Li{}
    case S47{} M.D{}:
      M.U{}
    case S47{} M.D2{}:
      M.U2{}
    case S47{} M.Di{}:
      M.Ui{}
    case S47{} M.L{}:
      M.F{}
    case S47{} M.L2{}:
      M.F2{}
    case S47{} M.Li{}:
      M.Fi{}
    case S47{} M.B{}:
      M.R{}
    case S47{} M.B2{}:
      M.R2{}
    case S47{} M.Bi{}:
      M.Ri{}
