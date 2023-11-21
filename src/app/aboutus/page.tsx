import { Box, Paper, Text } from "@mantine/core";
import Image from "next/image";
import classes from "./page.module.css";
import ewrb from "../assets/ewrb.webp";
import bulb from "../assets/bulb.webp";

export default function AboutUs() {
  return (
    <Box className={classes.about_grid}>
      <Paper shadow="sm" radius="md" withBorder p="xl" className={classes.ewrb}>
        <a href="https://kete.mbie.govt.nz/EW/EWPRSearch/practitioner/?id=efe7cde3-b142-df11-917a-005056ae567f">
          <Image src={ewrb} alt="Electrical Workers Registration Board" />
        </a>
      </Paper>
      <Paper
        shadow="sm"
        radius="md"
        withBorder
        p="xl"
        className={classes.about_text_1}
      >
        <Text>
          I founded Kevin Logan Electrical in 1992 and have since been proudly
          serving the North Shore community. Based in Torbay, you can count on
          me as your local electrician.
        </Text>
      </Paper>
      <Paper
        shadow="sm"
        radius="md"
        withBorder
        p="xl"
        className={classes.about_text_2}
      >
        <Text>
          I specialise in residential work, offering a competent and reliable
          electrical service you can count on. In addition, with my friendly and
          professional manner, I can answer any questions you may have about my
          business or services. I pride myself on quality workmanship and
          professional service from repairs and maintenance to installations.
          <br />
          <br />
          At Kevin Logan Electrical, my goal is to provide you with courteous,
          expedient, professional service of the highest calibre.
        </Text>
      </Paper>
      <Paper className={classes.bulb_container}>
        <Image src={bulb} alt="A blue lightbulb" unoptimized />
      </Paper>
    </Box>
  );
}
