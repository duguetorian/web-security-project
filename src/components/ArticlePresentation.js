import React from 'react';
import { Header, Image, Segment } from 'semantic-ui-react';


function ArticlePresentation({ article }) {
    return (
        <Segment as='button' onClick={() => console.log("coucou")} textAlign='center' padded style={{ margin: '20px'}}>
            <Image
                src={article.image.url || ""}
                size='small'
                rounded
            />
            <Header as='h5'>
                {article.title || ""}
            </Header>
        </Segment>
    )
}

export default ArticlePresentation;
