import React from 'react';
import { Grid, Header, Image, Segment } from 'semantic-ui-react';
import data from '../rss_example.json'
import { useLocation } from 'react-router-dom';


function ArticlePage() {
    const location = useLocation();
    return (
        <Segment.Group compact raised>
            <Segment>
                <span>{location.pathname}</span>
                <Grid centered relaxed='very'>
                    <Grid.Row>
                        <Header size='huge' as='a' href={data.link || ""}>
                            {data.title}
                        </Header>
                    </Grid.Row>
                    <Grid.Row>
                        <Image
                            rounded
                            src={data.image.url}
                            size='large'
                            as='a'
                            href={data.image.link || ""}
                            target='_blank' />
                    </Grid.Row>
                    <Grid.Row>
                        <Header size='small'>
                            {data.description}
                        </Header>
                    </Grid.Row>
                </Grid>
            </Segment>
            <Segment>
                <Grid centered relaxed='very'>
                    <Grid.Row>
                        <Header size='large' as='a' href={data.item.link || ""}>
                            {data.item.title}
                        </Header>
                    </Grid.Row>
                    <Grid.Row>
                        {data.item.description}
                    </Grid.Row>
                </Grid>
            </Segment>
        </Segment.Group>
    )
}

export default ArticlePage;
